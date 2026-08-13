import axios from "axios";
import { normalizeAdzunaJob } from "./jobNormalizer.js";

const ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api/jobs";
const MAX_RETRIES = 3;

// Adzuna officially supported countries mapping
const ADZUNA_SUPPORTED_COUNTRIES = {
  "gb": "gb", "united kingdom": "gb", "uk": "gb", "england": "gb", "london": "gb", "manchester": "gb",
  "us": "us", "united states": "us", "usa": "us", "america": "us", "new york": "us", "san francisco": "us", "california": "us",
  "de": "de", "germany": "de", "berlin": "de", "munich": "de",
  "fr": "fr", "france": "fr", "paris": "fr",
  "au": "au", "australia": "au", "sydney": "au", "melbourne": "au",
  "nz": "nz", "new zealand": "nz", "auckland": "nz",
  "ca": "ca", "canada": "ca", "toronto": "ca", "vancouver": "ca",
  "in": "in", "india": "in", "mumbai": "in", "bangalore": "in", "delhi": "in",
  "pl": "pl", "poland": "pl", "warsaw": "pl",
  "br": "br", "brazil": "br", "sao paulo": "br",
  "at": "at", "austria": "at", "vienna": "at",
  "za": "za", "south africa": "za", "johannesburg": "za", "cape town": "za"
};

const getSupportedAdzunaCountry = (location) => {
  if (!location) return "gb"; // Default fallback to GB if no location provided
  
  const normalizedLoc = location.toLowerCase().trim();
  
  if (normalizedLoc.includes("remote")) {
    return "gb"; 
  }
  
  for (const [key, code] of Object.entries(ADZUNA_SUPPORTED_COUNTRIES)) {
    if (normalizedLoc.includes(key)) {
      return code;
    }
  }
  
  return null; // Unsupported location
};

export const searchAdzunaJobs = async ({
  query,
  location,
  page = 1,
}) => {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) {
    throw new Error("Adzuna API credentials are not configured");
  }

  const country = getSupportedAdzunaCountry(location);
  
  if (!country) {
    console.log(`Adzuna skipped: Location "${location || 'None'}" is not supported by Adzuna.`);
    return { results: [] };
  }

  try {
    console.log(`Adzuna request for country [${country}] with query: "${query}"`);
    const response = await axios.get(
      `${ADZUNA_BASE_URL}/${country}/search/${page}`,
      {
        params: {
          app_id: appId,
          app_key: appKey,
          "content-type": "application/json",
          what: query,
          where: location,
          results_per_page: 20,
          sort_by: "date",
        },
        headers: {
          Accept: "application/json",
        },
        timeout: 15000, // Reduced timeout so it doesn't block the parallel flow long
      }
    );
    return response.data;
  } catch (error) {
    // Fail-safe handling: Catch 429, 503, timeouts, or rate limits and return empty gracefully
    console.warn(`Adzuna request failed (${error.response?.status || error.code || error.message}). Skipping Adzuna for this query.`);
    return { results: [] };
  }
};