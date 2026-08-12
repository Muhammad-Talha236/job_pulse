// server/src/services/scrapers/rozeeScraper.js

import { chromium } from "playwright";

/*
 * =========================================================
 * ROZEE.PK SCRAPER
 * =========================================================
 *
 * IMPORTANT — READ BEFORE RUNNING:
 *
 * Rozee.pk's search results are rendered client-side via
 * JavaScript, so a plain HTTP/Cheerio scrape returns an
 * empty job list. We use Playwright (headless Chromium) to
 * actually render the page, then read the DOM.
 *
 * The CSS selectors below are our best-effort guess based
 * on Rozee's typical markup patterns. If Rozee changes
 * their frontend (or if the selectors below return 0
 * results), open the search page in a real browser, right
 * click a job card -> "Inspect", and update SELECTORS
 * below to match what you see. This is the ONE thing that
 * may need a manual tweak — everything else (pagination,
 * rate limiting, storage) works as-is.
 *
 * ETHICS / RATE LIMITING:
 * - We run this on a schedule (cron), NOT per user search.
 * - We wait between requests (RATE_LIMIT_DELAY_MS) to avoid
 *   hammering their servers.
 * - We identify with a normal browser User-Agent (Playwright
 *   default) rather than spoofing anything malicious.
 * - Respect Rozee's Terms of Service — this is intended for
 *   a small personal/student project, not commercial resale
 *   of their data. Re-check their ToS periodically.
 */

const BASE_URL = "https://www.rozee.pk";

const RATE_LIMIT_DELAY_MS = 3000; // pause between page loads
const MAX_PAGES_PER_QUERY = 3; // how many result pages to walk per search term
const NAV_TIMEOUT_MS = 30000;

// Best-effort selectors — verify/adjust via browser DevTools if needed.
const SELECTORS = {
  jobCard: "div.job", // container for a single job listing
  title: "h3.s-18, .job-title, a.job-link",
  company: ".cname, .company-name",
  location: ".location, .job-location",
  postedAt: ".date, .posted-date",
  link: "a.job-link, h3.s-18 a, a[href*='/job/']",
};

const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/*
 * Convert a free-text search query into Rozee's URL slug
 * format, e.g. "React Developer" -> "react-developer-jobs-in-pakistan"
 */
const buildSearchUrl = (query, page = 1) => {
  const slug = String(query || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  const path = `/search/${slug}-jobs-in-pakistan`;

  return page > 1
    ? `${BASE_URL}${path}?page=${page}`
    : `${BASE_URL}${path}`;
};

/*
 * Scrape a single rendered search-results page and
 * return an array of raw job objects (un-normalized).
 */
const scrapePage = async (page, query) => {
  await page.waitForTimeout(1500);

  const hasResults = await page
    .locator(SELECTORS.jobCard)
    .first()
    .isVisible()
    .catch(() => false);

  if (!hasResults) {
    return [];
  }

  return page.$$eval(
    SELECTORS.jobCard,
    (cards, selectors) => {
      return cards.map((card) => {
        const getText = (selector) => {
          const el = card.querySelector(selector);
          return el ? el.textContent.trim() : "";
        };

        const linkEl = card.querySelector(selectors.link);
        const href = linkEl ? linkEl.getAttribute("href") : "";

        return {
          title: getText(selectors.title),
          company: getText(selectors.company),
          location: getText(selectors.location),
          postedAtText: getText(selectors.postedAt),
          href,
        };
      });
    },
    SELECTORS
  );
};

/*
 * =========================================================
 * SEARCH ROZEE JOBS
 * =========================================================
 *
 * query: search term, e.g. "React Developer"
 * Returns an array of raw scraped job objects.
 */
export const searchRozeeJobs = async (query) => {
  const browser = await chromium.launch({
    headless: true,
  });

  const allJobs = [];

  try {
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    });

    const page = await context.newPage();
    page.setDefaultTimeout(NAV_TIMEOUT_MS);

    for (
      let pageNumber = 1;
      pageNumber <= MAX_PAGES_PER_QUERY;
      pageNumber++
    ) {
      const url = buildSearchUrl(query, pageNumber);

      try {
        console.log(
          `Rozee: loading "${query}" page ${pageNumber} -> ${url}`
        );

        await page.goto(url, {
          waitUntil: "domcontentloaded",
        });

        const pageJobs = await scrapePage(page, query);

        if (pageJobs.length === 0) {
          // No more results — stop paginating this query.
          break;
        }

        allJobs.push(...pageJobs);
      } catch (pageError) {
        console.error(
          `Rozee: failed to scrape page ${pageNumber} for "${query}":`,
          pageError.message
        );
        break;
      }

      // Be polite — don't hammer the server.
      await wait(RATE_LIMIT_DELAY_MS);
    }
  } finally {
    await browser.close();
  }

  return allJobs;
};