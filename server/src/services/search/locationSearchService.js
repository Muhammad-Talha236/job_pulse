import axios from "axios";
import pool from "../../config/db.js";

const GEONAMES_URL = "https://secure.geonames.org/searchJSON";
const GEONAMES_USERNAME = process.env.GEONAMES_USERNAME;
const MAX_RESULTS = 8;
const CACHE_TTL_HOURS = 24 * 30; // city data barely changes

const normalizeGeonameEntry = (entry) => {
  const city = entry.name;
  const state = entry.adminName1 || null;
  const country = entry.countryName || null;

  return {
    value: [city, state, country].filter(Boolean).join(", "),
    meta: [state, country].filter(Boolean).join(", ") || "Location",
    data: {
      provider: "geonames",
      placeId: entry.geonameId ? String(entry.geonameId) : null,
      city,
      state,
      country,
      countryCode: entry.countryCode || null,
      latitude: entry.lat ? Number(entry.lat) : null,
      longitude: entry.lng ? Number(entry.lng) : null,
    },
  };
};

const getCachedResults = async (q) => {
  try {
    const result = await pool.query(
      `SELECT results FROM location_search_cache
       WHERE LOWER(query_text) = LOWER($1)
         AND created_at > NOW() - ($2 || ' hours')::interval
       LIMIT 1;`,
      [q, CACHE_TTL_HOURS]
    );
    return result.rows[0]?.results || null;
  } catch (error) {
    console.error("Location cache read failed:", error.message);
    return null;
  }
};

const writeCache = async (q, results) => {
  try {
    await pool.query(
      `INSERT INTO location_search_cache (query_text, results) VALUES ($1, $2)
       ON CONFLICT (LOWER(query_text))
       DO UPDATE SET results = EXCLUDED.results, created_at = CURRENT_TIMESTAMP;`,
      [q, JSON.stringify(results)]
    );
  } catch (error) {
    console.error("Location cache write failed:", error.message);
  }
};

const searchCacheFuzzy = async (q) => {
  try {
    const result = await pool.query(
      `SELECT results FROM location_search_cache
       WHERE query_text % $1
       ORDER BY similarity(query_text, $1) DESC
       LIMIT 1;`,
      [q]
    );
    return result.rows[0]?.results || [];
  } catch (error) {
    console.error("Location fuzzy fallback failed:", error.message);
    return [];
  }
};

export const searchLocations = async (query) => {
  const q = query.trim();
  if (q.length < 2) return [];

  const cached = await getCachedResults(q);
  if (cached) return cached;

  if (!GEONAMES_USERNAME) {
    console.warn("GEONAMES_USERNAME not set — using cache fallback only.");
    return searchCacheFuzzy(q);
  }

  try {
    const response = await axios.get(GEONAMES_URL, {
      params: {
        q,
        maxRows: MAX_RESULTS,
        username: GEONAMES_USERNAME,
        featureClass: "P",
        orderby: "population",
        fuzzy: 0.8,
        isNameRequired: true,
        style: "MEDIUM",
        lang: "en",
      },
      timeout: 5000,
    });

    const results = Array.from(
      new Map(
        (response.data?.geonames || [])
          .map(normalizeGeonameEntry)
          .map((item) => [item.value, item])
      ).values()
    );

    await writeCache(q, results);
    return results;
  } catch (error) {
    console.error("GeoNames search failed, using cache fallback:", error.message);
    return searchCacheFuzzy(q);
  }
};