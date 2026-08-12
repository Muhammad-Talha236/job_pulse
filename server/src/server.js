// backend/src/server.js

import "dotenv/config";

import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { startRozeeScrapeSchedule } from "./jobs/rozeeScrapeJob.js";
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    /*
     * Test database connection first.
     */
    await connectDatabase();

    /*
     * Start Express only after the database
     * connection has been verified.
     */
    app.listen(PORT, () => {
      console.log(`JobPulse API running on port ${PORT}`);
    });

    /*
     * Start the Rozee.pk scraping schedule.
     *
     * This runs independently of incoming requests — it
     * populates/refreshes the `external_jobs` table every
     * few hours so that job searches never trigger a live
     * scrape (see src/jobs/rozeeScrapeJob.js).
     *
     * Set DISABLE_ROZEE_SCRAPER=true in .env to skip this
     * during local development if you don't want Playwright
     * launching a browser on every restart.
     */
    if (process.env.DISABLE_ROZEE_SCRAPER !== "true") {
      startRozeeScrapeSchedule();
    }
  } catch (error) {
    console.error(
      "Failed to start JobPulse server:",
      error.message
    );

    process.exit(1);
  }
};

startServer();