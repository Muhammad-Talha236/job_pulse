// server/src/jobs/rozeeScrapeJob.js

import cron from "node-cron";

import { searchRozeeJobs } from "../services/scrapers/rozeeScraper.js";
import { normalizeRozeeJob } from "../services/scrapers/rozeeNormalizer.js";
import { upsertExternalJobs } from "../repositories/externalJobsRepository.js";

/*
 * =========================================================
 * SEED SEARCH TERMS
 * =========================================================
 *
 * Rozee doesn't give us a "browse everything" endpoint we
 * can page through cheaply, so instead we periodically
 * scrape a curated list of common terms that Pakistani
 * students/job-seekers actually search for. This keeps the
 * local job pool broad without scraping blindly.
 *
 * Add/remove terms here as needed — this list directly
 * controls what shows up in the cached pool.
 */
const SEED_QUERIES = [
  "software engineer",
  "web developer",
  "react developer",
  "mern stack developer",
  "frontend developer",
  "backend developer",
  "full stack developer",
  "data analyst",
  "data science",
  "python developer",
  "java developer",
  "digital marketing",
  "graphic designer",
  "content writer",
  "customer support",
  "accountant",
  "sales executive",
  "human resources",
  "civil engineer",
  "electrical engineer",
  "internship",
];

const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/*
 * =========================================================
 * RUN ONE FULL SCRAPE CYCLE
 * =========================================================
 */
export const runRozeeScrapeCycle = async () => {
  console.log(
    `[Rozee scraper] Starting scrape cycle for ${SEED_QUERIES.length} terms...`
  );

  let totalScraped = 0;

  for (const term of SEED_QUERIES) {
    try {
      const rawJobs = await searchRozeeJobs(term);

      if (rawJobs.length === 0) {
        console.log(
          `[Rozee scraper] "${term}" -> 0 jobs found`
        );
        continue;
      }

      const normalizedJobs = rawJobs
        .map(normalizeRozeeJob)
        .filter((job) => job.title && job.url);

      await upsertExternalJobs(normalizedJobs);

      totalScraped += normalizedJobs.length;

      console.log(
        `[Rozee scraper] "${term}" -> ${normalizedJobs.length} jobs stored`
      );
    } catch (error) {
      console.error(
        `[Rozee scraper] Failed for term "${term}":`,
        error.message
      );
    }

    // Small pause between search terms too, on top of the
    // per-page delay already inside searchRozeeJobs().
    await wait(2000);
  }

  console.log(
    `[Rozee scraper] Cycle complete. Total jobs stored: ${totalScraped}`
  );
};

/*
 * =========================================================
 * SCHEDULE
 * =========================================================
 *
 * Runs every 4 hours. Call startRozeeScrapeSchedule() once
 * from server.js at startup.
 */
export const startRozeeScrapeSchedule = () => {
  // Run once shortly after server start (don't block startup).
  setTimeout(() => {
    runRozeeScrapeCycle().catch((error) =>
      console.error(
        "[Rozee scraper] Initial run failed:",
        error.message
      )
    );
  }, 10000);

  // Then every 4 hours: minute 0, every 4th hour.
  cron.schedule("0 */4 * * *", () => {
    runRozeeScrapeCycle().catch((error) =>
      console.error(
        "[Rozee scraper] Scheduled run failed:",
        error.message
      )
    );
  });

  console.log(
    "[Rozee scraper] Schedule registered (every 4 hours)."
  );
};