import axios from "axios";
import { normalizeAdzunaJob } from "./jobNormalizer.js";

const ADZUNA_BASE_URL =
  "https://api.adzuna.com/v1/api/jobs";

const MAX_RETRIES = 3;

export const searchAdzunaJobs = async ({
  query,
  location,
  page = 1,
}) => {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    throw new Error(
      "Adzuna API credentials are not configured"
    );
  }

  const country = "gb";

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `Adzuna request attempt ${attempt}/${MAX_RETRIES}`
      );

      const response = await axios.get(
        `${ADZUNA_BASE_URL}/${country}/search/${page}`,
        {
          params: {
            app_id: appId,
            app_key: appKey,
            "content-type": "application/json",
            what: query,
            where: location || undefined,
            results_per_page: 20,
            sort_by: "date",
          },

          headers: {
            Accept: "application/json",
          },

          timeout: 30000,
        }
      );

      console.log(
        `Adzuna request successful on attempt ${attempt}`
      );

      return response.data;
    } catch (error) {
      console.error(
        `Adzuna attempt ${attempt} failed:`,
        error.code || error.message
      );

      // If this was the final attempt, throw the error.
      if (attempt === MAX_RETRIES) {
        console.error(
          "Adzuna API failed after all retry attempts:",
          error.response?.data || error.message
        );

        throw new Error(
          "Unable to fetch jobs from Adzuna"
        );
      }

      // Wait before trying again.
      const delay = attempt * 2000;

      console.log(
        `Retrying Adzuna in ${delay / 1000} seconds...`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, delay)
      );
    }
  }
};