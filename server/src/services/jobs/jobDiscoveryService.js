import { searchAdzunaJobs } from "./adzunaService.js";
import { normalizeAdzunaJob } from "./jobNormalizer.js";

import { searchMuseJobs } from "./museService.js";
import { normalizeMuseJob } from "./museNormalizer.js";

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

    // Multiple words:
    // At least half should match.
    const minimumMatches = Math.ceil(tokens.length / 2);

    return matchedTokens >= minimumMatches;
  });
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

  /*
   * IMPORTANT
   *
   * Adzuna and The Muse are intentionally requested
   * at the same time.
   *
   * Promise.allSettled() means:
   *
   * Adzuna succeeds + Muse fails
   *      -> Adzuna jobs are still returned
   *
   * Adzuna fails + Muse succeeds
   *      -> Muse jobs are still returned
   *
   * Both succeed
   *      -> both are combined
   */
  const [adzunaResult, museResult] =
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

        // Muse starts from page 0
        page: currentPage - 1,
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
        `${job.source}-${job.externalId}`,
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
  // RESPONSE
  // =========================================================

  return {
    count: relevantJobs.length,

    jobs: relevantJobs,

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