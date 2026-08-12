// server/src/services/scrapers/rozeeNormalizer.js

const ROZEE_BASE_URL = "https://www.rozee.pk";

/*
 * Rozee doesn't give us a clean numeric ID from the search
 * page, so we derive a stable ID from the job URL (which
 * usually contains rozee's own job id, e.g. /job/xyz-123456).
 */
const extractExternalId = (href) => {
  if (!href) return null;

  const match = href.match(/(\d{4,})/);

  if (match) {
    return match[1];
  }

  // Fallback: hash the href itself
  return Buffer.from(href).toString("base64").slice(0, 24);
};

const resolveUrl = (href) => {
  if (!href) return "";

  if (href.startsWith("http")) {
    return href;
  }

  return `${ROZEE_BASE_URL}${href.startsWith("/") ? "" : "/"}${href}`;
};

/*
 * Rozee shows relative dates like "2 days ago", "Today",
 * "Posted 1 week ago". We do a best-effort conversion to
 * an actual Date; if we can't parse it, we leave it null
 * rather than guessing wrong.
 */
const parsePostedAt = (text) => {
  if (!text) return null;

  const normalized = text.toLowerCase().trim();

  const now = new Date();

  if (normalized.includes("today")) {
    return now;
  }

  if (normalized.includes("yesterday")) {
    now.setDate(now.getDate() - 1);
    return now;
  }

  const daysMatch = normalized.match(/(\d+)\s*day/);
  if (daysMatch) {
    now.setDate(now.getDate() - Number(daysMatch[1]));
    return now;
  }

  const weeksMatch = normalized.match(/(\d+)\s*week/);
  if (weeksMatch) {
    now.setDate(now.getDate() - Number(weeksMatch[1]) * 7);
    return now;
  }

  const monthsMatch = normalized.match(/(\d+)\s*month/);
  if (monthsMatch) {
    now.setMonth(now.getMonth() - Number(monthsMatch[1]));
    return now;
  }

  return null;
};

/*
 * Converts one raw scraped Rozee job into the app's
 * standard normalized job shape (same shape as
 * normalizeAdzunaJob / normalizeMuseJob).
 */
export const normalizeRozeeJob = (rawJob) => {
  const url = resolveUrl(rawJob.href);

  return {
    externalId: extractExternalId(rawJob.href) || url,
    source: "rozee",
    title: rawJob.title || "Untitled Job",
    company: rawJob.company || "Unknown Company",
    location: rawJob.location || "Pakistan",
    description: "", // not available on the search-results card
    url,
    category: null,
    contractType: null,
    salaryMin: null,
    salaryMax: null,
    salaryPredicted: false,
    postedAt: parsePostedAt(rawJob.postedAtText),
    adref: null,
  };
};