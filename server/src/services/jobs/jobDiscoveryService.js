import { searchAdzunaJobs } from "./adzunaService.js";
import { normalizeAdzunaJob } from "./jobNormalizer.js";

import { searchMuseJobs } from "./museService.js";
import { normalizeMuseJob } from "./museNormalizer.js";

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

  // =========================================================
  // RESPONSE
  // =========================================================

  return {
    count: uniqueJobs.length,

    jobs: uniqueJobs,

    sources: sources.map((source) => ({
      name: source.source,
      count: source.jobs.length,
      total: source.total,
    })),

    page: currentPage,

    hasNextPage: sources.some(
      (source) =>
        source.total > currentPage * 20 ||
        source.jobs.length === 20
    ),

    hasPreviousPage: currentPage > 1,
  };
};