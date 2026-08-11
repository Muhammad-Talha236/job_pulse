import { searchAdzunaJobs } from "./adzunaService.js";
import { normalizeAdzunaJob } from "./jobNormalizer.js";

import { searchMuseJobs } from "./museService.js";
import { normalizeMuseJob } from "./museNormalizer.js";

// =========================================================
// DISCOVER JOBS
// =========================================================
const filterRelevantJobs = (
  jobs,
  query
) => {
  const normalizedQuery =
    String(
      query || ""
    )
      .trim()
      .toLowerCase();

  if (!normalizedQuery) {
    return jobs;
  }

  const tokens =
    normalizedQuery
      .split(/\s+/)
      .map((token) =>
        token.replace(
          /[^\w+#.-]/g,
          ""
        )
      )
      .filter(
        (token) =>
          token.length >= 2
      );

  if (
    tokens.length === 0
  ) {
    return [];
  }

  return jobs.filter(
    (job) => {
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
      if (
        searchableText.includes(
          normalizedQuery
        )
      ) {
        return true;
      }

      const matchedTokens =
        tokens.filter(
          (token) =>
            searchableText.includes(
              token
            )
        ).length;

      // Single word:
      // it MUST actually exist.
      if (
        tokens.length === 1
      ) {
        return (
          matchedTokens === 1
        );
      }

      // Multiple words:
      // at least half should match.
      const minimumMatches =
        Math.ceil(
          tokens.length / 2
        );

      return (
        matchedTokens >=
        minimumMatches
      );
    }
  );
};
export const discoverJobs = async ({
  query,
  location,
  page = 1,
}) => {
  const currentPage = Math.max(1, Number(page) || 1);

  const sources = [];

  // =========================================================
  // ADZUNA
  // =========================================================

  try {
    const adzunaData = await searchAdzunaJobs({
      query,
      location,
      page: currentPage,
    });

    const jobs = (adzunaData.results || []).map(
      normalizeAdzunaJob
    );

    sources.push({
      source: "adzuna",
      jobs,
      count: jobs.length,
      total: adzunaData.count || 0,
    });
  } catch (error) {
    console.error(
      "Adzuna source failed:",
      error.message
    );
  }

  // =========================================================
  // THE MUSE
  // =========================================================

  try {
    const museData = await searchMuseJobs({
      query,
      location,

      // Muse starts from page 0
      page: currentPage - 1,
    });

    const jobs = (museData.results || []).map(
      normalizeMuseJob
    );

    sources.push({
      source: "muse",
      jobs,
      count: jobs.length,
      total: museData.total || 0,
    });
  } catch (error) {
    console.error(
      "Muse source failed:",
      error.message
    );
  }

  // =========================================================
  // COMBINE + DEDUPLICATE
  // =========================================================

  const allJobs = sources.flatMap(
    (source) => source.jobs
  );

  const uniqueJobs = Array.from(
    new Map(
      allJobs.map((job) => [
        `${job.source}-${job.externalId}`,
        job,
      ])
    ).values()
  );
const relevantJobs =
  filterRelevantJobs(
    uniqueJobs,
    query
  );
  // =========================================================
  // RESPONSE
  // =========================================================
return {
  count: relevantJobs.length,

  jobs: relevantJobs,

  sources: sources.map(
    (source) => ({
      name: source.source,
      count: source.jobs.length,
      total: source.total,
    })
  ),

  page: currentPage,

  hasNextPage:
    sources.some(
      (source) =>
        source.total >
          currentPage * 20 ||
        source.jobs.length === 20
    ),

  hasPreviousPage:
    currentPage > 1,
};
};