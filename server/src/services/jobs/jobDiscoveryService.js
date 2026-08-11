import { searchAdzunaJobs } from "./adzunaService.js";
import { normalizeAdzunaJob } from "./jobNormalizer.js";

import { searchMuseJobs } from "./museService.js";
import { normalizeMuseJob } from "./museNormalizer.js";

export const discoverJobs = async ({
  query,
  location,
  page = 1,
}) => {
  const sources = [];

  // =========================================================
  // ADZUNA
  // =========================================================

  try {
    const adzunaData = await searchAdzunaJobs({
      query,
      location,
      page,
    });

    console.log(
      "Adzuna raw results:",
      adzunaData.results?.length || 0
    );

    const jobs = (adzunaData.results || []).map(
      normalizeAdzunaJob
    );

    sources.push({
      source: "adzuna",
      jobs,
      count: jobs.length,
    });
  } catch (error) {
    console.error(
      "Adzuna source failed:",
      error.message
    );
  }

  // =========================================================
  // MUSE
  // =========================================================

  try {
    const museData = await searchMuseJobs({
      query,
      location,
      page: Math.max(0, page - 1),
    });

    console.log(
      "Muse raw results:",
      museData.results?.length || 0
    );

    const jobs = (museData.results || []).map(
      normalizeMuseJob
    );

    sources.push({
      source: "muse",
      jobs,
      count: jobs.length,
    });
  } catch (error) {
    console.error(
      "Muse source failed:",
      error.message
    );
  }

  // =========================================================
  // COMBINE
  // =========================================================

  const jobs = sources.flatMap(
    (source) => source.jobs
  );

  const uniqueJobs = Array.from(
    new Map(
      jobs.map((job) => [
        `${job.source}-${job.externalId}`,
        job,
      ])
    ).values()
  );

  return {
    jobs: uniqueJobs,
    count: uniqueJobs.length,

    sources: sources.map((source) => ({
      name: source.source,
      count: source.jobs.length,
    })),

    page,
  };
};