import axios from "axios";
import { normalizeAdzunaJob } from "./jobNormalizer.js";

const ADZUNA_BASE_URL =
  "https://api.adzuna.com/v1/api/jobs";

export const searchAdzunaJobs = async ({
  query,
  location,
  page = 1,
}) => {
  try {
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;

    if (!appId || !appKey) {
      throw new Error(
        "Adzuna API credentials are not configured"
      );
    }

    const country = "gb";

    const response = await axios.get(
      `${ADZUNA_BASE_URL}/${country}/search/${page}`,
      {
        params: {
          app_id: appId,
          app_key: appKey,

          what: query,

          where: location || undefined,

          results_per_page: 20,

          "content-type": "application/json",

          sort_by: "date",
        },

        headers: {
          Accept: "application/json",
        },

        timeout: 30000,
      }
    );

    // Normalize Adzuna jobs before sending them
    // to the controller/frontend.
    const normalizedJobs = (
      response.data.results || []
    ).map(normalizeAdzunaJob);

    return {
      ...response.data,
      results: normalizedJobs,
    };
  } catch (error) {
    console.error(
      "Adzuna API error:",
      error.response?.data || error.message
    );

    throw new Error(
      "Unable to fetch jobs from Adzuna"
    );
  }
};