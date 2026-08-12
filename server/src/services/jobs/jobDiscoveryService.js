import { searchAdzunaJobs } from "./adzunaService.js";
import { normalizeAdzunaJob } from "./jobNormalizer.js";
import { searchMuseJobs } from "./museService.js";
import { normalizeMuseJob } from "./museNormalizer.js";
import { searchJoobleJobs } from "./joobleService.js";
import { normalizeJoobleJob } from "./jobNormalizer.js";

// =========================================================
// FILTER RELEVANT JOBS
// =========================================================
const filterRelevantJobs = (jobs, query) => {
  const normalizedQuery = String(query || "")
    .trim()
    .toLowerCase();
  if (!normalizedQuery) {
    return jobs;
  }
  const tokens = normalizedQuery
    .split(/\s+/)
    .map((token) => token.replace(/[^\w+#.-]/g, ""))
    .filter((token) => token.length >= 2);
  if (tokens.length === 0) {
    return [];
  }
  return jobs.filter((job) => {
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
    if (!searchableText) {
      return false;
    }
    // Exact phrase match
    if (searchableText.includes(normalizedQuery)) {
      return true;
    }
    const matchedTokens = tokens.filter((token) =>
      searchableText.includes(token)
    ).length;
    // Single word:
    // It MUST actually exist in the job.
    if (tokens.length === 1) {
      return matchedTokens === 1;
    }
    // All tokens matched -> definitely relevant
    if (matchedTokens === tokens.length) {
      return true;
    }
    // Multiple words:
    // At least 75% should match.
    const minimumMatches = Math.ceil(
      tokens.length * 0.75
    );
    return matchedTokens >= minimumMatches;
  });
};

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
// DISCOVER JOBS
// =========================================================
export const discoverJobs = async ({
  query,
  location,
  page = 1,
}) => {
  const currentPage = Math.max(
    1,
    Number(page) || 1
  );

  const [adzunaResult, museResult, joobleResult] =
    await Promise.allSettled([
      // =====================================================
      // ADZUNA
      // =====================================================
      searchAdzunaJobs({
        query,
        location,
        page: currentPage,
      }),
      // =====================================================
      // THE MUSE
      // =====================================================
      searchMuseJobs({
        query,
        location,
        page: currentPage - 1,
      }),
      // =====================================================
      // JOOBLE
      // =====================================================
      searchJoobleJobs({
        query,
        location,
        page: currentPage,
      }),
    ]);

  const sources = [];

  // =========================================================
  // PROCESS ADZUNA RESULT
  // =========================================================
  if (adzunaResult.status === "fulfilled") {
    try {
      const adzunaData = adzunaResult.value;
      const jobs = (
        adzunaData?.results || []
      ).map(normalizeAdzunaJob);
      sources.push({
        source: "adzuna",
        jobs,
        count: jobs.length,
        total: adzunaData?.count || 0,
      });
    } catch (error) {
      console.error(
        "Adzuna normalization failed:",
        error.message
      );
    }
  } else {
    console.error(
      "Adzuna source failed:",
      adzunaResult.reason?.message ||
        adzunaResult.reason
    );
  }

  // =========================================================
  // PROCESS THE MUSE RESULT
  // =========================================================
  if (museResult.status === "fulfilled") {
    try {
      const museData = museResult.value;
      const jobs = (
        museData?.results || []
      ).map(normalizeMuseJob);
      sources.push({
        source: "muse",
        jobs,
        count: jobs.length,
        total: museData?.total || 0,
      });
    } catch (error) {
      console.error(
        "Muse normalization failed:",
        error.message
      );
    }
  } else {
    console.error(
      "Muse source failed:",
      museResult.reason?.message ||
        museResult.reason
    );
  }

  // =========================================================
  // PROCESS JOOBLE RESULT
  // =========================================================
  if (joobleResult.status === "fulfilled") {
    try {
      const joobleData = joobleResult.value;
      const jobs = (
        joobleData?.jobs || []
      ).map(normalizeJoobleJob);
      sources.push({
        source: "jooble",
        jobs,
        count: jobs.length,
        total: joobleData?.totalCount || 0,
      });
    } catch (error) {
      console.error(
        "Jooble normalization failed:",
        error.message
      );
    }
  } else {
    console.error(
      "Jooble source failed:",
      joobleResult.reason?.message ||
        joobleResult.reason
    );
  }

  // =========================================================
  // COMBINE JOBS
  // =========================================================
  const allJobs = sources.flatMap(
    (source) => source.jobs
  );

  // =========================================================
  // DEDUPLICATE (Updated to prevent source overwriting)
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

  // =========================================================
  // RESPONSE
  // =========================================================
  return {
    count: sortedJobs.length,
    jobs: sortedJobs,
    sources: sources.map((source) => ({
      name: source.source,
      count: source.jobs.length,
      total: source.total,
    })),
    page: currentPage,
    hasNextPage: sources.some(
      (source) =>
        source.total >
          currentPage * 20 ||
        source.jobs.length === 20
    ),
    hasPreviousPage:
      currentPage > 1,
  };
};