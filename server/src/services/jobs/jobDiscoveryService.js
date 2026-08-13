import { searchAdzunaJobs } from "./adzunaService.js";
import { normalizeAdzunaJob } from "./jobNormalizer.js";
import { searchMuseJobs } from "./museService.js";
import { normalizeMuseJob } from "./museNormalizer.js";
import { searchJoobleJobs } from "./joobleService.js";
import { normalizeJoobleJob } from "./jobNormalizer.js";
import { searchExternalJobs } from "../../repositories/externalJobsRepository.js";


const NON_TECH_KEYWORDS = [
  "nurse", "nursing", "cook", "doctor", "urologist", "cardiologist", 
  "therapist", "pipefitter", "sonographer", "speech pathologist", 
  "hospital", "clinical", "patient", "medical"
];

const filterRelevantJobs = (jobs, query) => {
  const normalizedQuery = String(query || "").trim().toLowerCase();
  
  // 1. Agar query empty hai (Recommendation Mode)
  if (!normalizedQuery) {
    const passed = jobs.filter((job) => {
      const title = String(job?.title || "").toLowerCase();
      const isNonTech = NON_TECH_KEYWORDS.some((keyword) => title.includes(keyword));
      return !isNonTech;
    });
    console.log(`[DEBUG RECOMMENDATION FILTER] Total jobs before filter: ${jobs.length}, Passed: ${passed.length}, Dropped: ${jobs.length - passed.length}`);
    return passed;
  }

  // 2. Manual Search Mode
  const tokens = normalizedQuery
    .split(/\s+/)
    .map((token) => token.replace(/[^\w+#.-]/g, ""))
    .filter((token) => token.length >= 2);

  if (tokens.length === 0) return jobs;

  const filtered = jobs.filter((job) => {
    const title = String(job?.title || "").toLowerCase();
    const isNonTech = NON_TECH_KEYWORDS.some((keyword) => title.includes(keyword));
    if (isNonTech) return false;

    const searchableText = [
      job?.title,
      job?.company,
      job?.description,
      job?.location,
      job?.contractType,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!searchableText) return false;

    if (searchableText.includes(normalizedQuery)) return true;

    const matchedTokens = tokens.filter((token) => searchableText.includes(token)).length;
    
    if (tokens.length === 1) return matchedTokens === 1;
    if (matchedTokens === tokens.length) return true;

    const minimumMatches = Math.max(1, Math.floor(tokens.length * 0.3));
    return matchedTokens >= minimumMatches;
  });

  console.log(`[DEBUG SEARCH FILTER] Query: "${query}" | Total before: ${jobs.length} | Passed after filter: ${filtered.length} | Dropped: ${jobs.length - filtered.length}`);
  return filtered;
};
;
// =========================================================
// SCORE + SORT BY RELEVANCE
// =========================================================
const scoreJobRelevance = (job, query) => {
  const normalizedQuery = String(query || "")
    .trim()
    .toLowerCase();
  if (!normalizedQuery) return 0;
  const title = String(job?.title || "").toLowerCase();
  const description = String(
    job?.description || ""
  ).toLowerCase();
  let score = 0;
  if (title.includes(normalizedQuery)) {
    score += 50;
  }
  const tokens = normalizedQuery
    .split(/\s+/)
    .filter((token) => token.length >= 2);
  tokens.forEach((token) => {
    if (title.includes(token)) score += 15;
    if (description.includes(token)) score += 3;
  });
  return score;
};

// =========================================================
// CONVERT A DB ROW (external_jobs) INTO THE STANDARD SHAPE
// =========================================================
//
// The scraped-jobs table stores columns in snake_case
// (Postgres convention). The rest of the app (Adzuna/Muse/
// Jooble normalizers) uses camelCase. We convert here so
// downstream code (filtering, scoring, JobCard rendering)
// doesn't need to know the difference between a live API
// result and a cached scraped row.
const mapExternalJobRow = (row) => ({
  externalId: row.external_id,
  source: row.source,
  title: row.title,
  company: row.company,
  location: row.location,
  description: row.description || "",
  url: row.url,
  category: row.category,
  contractType: row.contract_type,
  salaryMin: row.salary_min,
  salaryMax: row.salary_max,
  salaryPredicted: false,
  postedAt: row.posted_at,
  adref: null,
});

// =========================================================
// HOW MANY EXTERNAL PAGES TO PULL PER LIVE SOURCE
// =========================================================
const ADZUNA_PAGES = [1, 2, 3];
const MUSE_PAGES = [0, 1, 2];
const JOOBLE_PAGES = [1, 2, 3];

const fetchAllPages = async (fetchPageFn, pages) => {
  const results = await Promise.allSettled(
    pages.map((page) => fetchPageFn(page))
  );

  return results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);
};

// =========================================================
// DISCOVER JOBS
// =========================================================
//
// Combines:
//  1. Live results from Adzuna, The Muse, Jooble
//  2. Cached Rozee.pk results from our own database
//     (populated by the scheduled scraper — see
//     src/jobs/rozeeScrapeJob.js)
//
// Returns the FULL relevant list in one response; the
// frontend paginates locally.
export const discoverJobs = async ({
  query,
  location,
}) => {
  const [
    adzunaPageResults,
    musePageResults,
    joobPageResults,
    rozeeRows,
  ] = await Promise.all([
    fetchAllPages(
      (page) =>
        searchAdzunaJobs({
          query,
          location,
          page,
        }),
      ADZUNA_PAGES
    ),
    fetchAllPages(
      (page) =>
        searchMuseJobs({
          query,
          location,
          page,
        }),
      MUSE_PAGES
    ),
    fetchAllPages(
      (page) =>
        searchJoobleJobs({
          query,
          location,
          page,
        }),
      JOOBLE_PAGES
    ),
    searchExternalJobs({
      query,
      location,
      source: "rozee",
    }).catch((error) => {
      console.error(
        "Rozee cache lookup failed:",
        error.message
      );
      return [];
    }),
  ]);

  const sources = [];

  // =========================================================
  // PROCESS ADZUNA RESULTS
  // =========================================================
  try {
    const jobs = adzunaPageResults.flatMap(
      (pageData) =>
        (pageData?.results || []).map(
          normalizeAdzunaJob
        )
    );
console.log(`[RAW STATS] Adzuna fetched: ${jobs.length} jobs`); // <-- Yeh log add karein
    sources.push({
      source: "adzuna",
      jobs,
      count: jobs.length,
    });
  } catch (error) {
    console.error(
      "Adzuna normalization failed:",
      error.message
    );
  }

  // =========================================================
  // PROCESS THE MUSE RESULTS
  // =========================================================
  try {
    const jobs = musePageResults.flatMap(
      (pageData) =>
        (pageData?.results || []).map(
          normalizeMuseJob
        )
    );
   console.log(`[RAW STATS] Muse fetched: ${jobs.length} jobs`); // <-- Yeh log add karein
    sources.push({
      source: "muse",
      jobs,
      count: jobs.length,
    });
  } catch (error) {
    console.error(
      "Muse normalization failed:",
      error.message
    );
  }

  // =========================================================
  // PROCESS JOOBLE RESULTS
  // =========================================================
  try {
    const jobs = joobPageResults.flatMap(
      (pageData) =>
        (pageData?.jobs || []).map(
          normalizeJoobleJob
        )
    );
  console.log(`[RAW STATS] Jooble fetched: ${jobs.length} jobs`); // <-- Yeh log add karein
    sources.push({
      source: "jooble",
      jobs,
      count: jobs.length,
    });
  } catch (error) {
    console.error(
      "Jooble normalization failed:",
      error.message
    );
  }

  // =========================================================
  // PROCESS ROZEE (CACHED) RESULTS
  // =========================================================
  try {
    const jobs = rozeeRows.map(mapExternalJobRow);

    sources.push({
      source: "rozee",
      jobs,
      count: jobs.length,
    });
  } catch (error) {
    console.error(
      "Rozee row mapping failed:",
      error.message
    );
  }

  // =========================================================
  // COMBINE JOBS
  // =========================================================
  const allJobs = sources.flatMap(
    (source) => source.jobs
  );

  // =========================================================
  // DEDUPLICATE
  // =========================================================
  const uniqueJobs = Array.from(
    new Map(
      allJobs.map((job) => [
        `${job.source}-${job.externalId || (job.title + job.company).replace(/\s/g, '')}`,
        job,
      ])
    ).values()
  );

  // =========================================================
  // FILTER RELEVANT JOBS
  // =========================================================
  //
  // Rozee rows already came pre-filtered by Postgres
  // full-text search, but we run them through the same
  // filter here too for consistency with the other sources.
  const relevantJobs = filterRelevantJobs(
    uniqueJobs,
    query
  );

  // =========================================================
  // SORT BY RELEVANCE (title matches first)
  // =========================================================
  const sortedJobs = [...relevantJobs].sort(
    (a, b) =>
      scoreJobRelevance(b, query) -
      scoreJobRelevance(a, query)
  );


  console.log(`[DEBUG FINAL] Total sorted & ready jobs sent to frontend: ${sortedJobs.length}`);
  // =========================================================
  // RESPONSE
  // =========================================================
  return {
    count: sortedJobs.length,
    jobs: sortedJobs,
    sources: sources.map((source) => ({
      name: source.source,
      count: source.jobs.length,
    })),
  };
};