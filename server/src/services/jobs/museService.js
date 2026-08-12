import axios from "axios";

const MUSE_BASE_URL =
  "https://www.themuse.com/api/public/jobs";

const MAX_RETRIES = 3;

export const searchMuseJobs = async ({
  query,
  location,
  page = 0,
}) => {
  for (
    let attempt = 1;
    attempt <= MAX_RETRIES;
    attempt++
  ) {
    try {
      console.log(
        `Muse request attempt ${attempt}/${MAX_RETRIES}`
      );

      const response = await axios.get(
        MUSE_BASE_URL,
        {
          params: {
            page,

            ...(location
              ? { location }
              : {}),
          },

          headers: {
            Accept: "application/json",
          },

          timeout: 30000,
        }
      );

      console.log(
        `Muse request successful on attempt ${attempt}`
      );

      return response.data;
    } catch (error) {
      console.error(
        `Muse attempt ${attempt} failed:`,
        error.code || error.message
      );

      if (attempt === MAX_RETRIES) {
        console.error(
          "Muse API failed after all retry attempts:",
          error.response?.data ||
            error.message
        );

        throw new Error(
          "Unable to fetch jobs from Muse"
        );
      }

      const delay = attempt * 2000;

      console.log(
        `Retrying Muse in ${
          delay / 1000
        } seconds...`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, delay)
      );
    }
  }
};

// NOTE:
// The Muse's public API does NOT support a generic
// free-text "what" search parameter like Adzuna does.
// It also does NOT accept arbitrary keywords through the
// "category" param — that param only accepts a small fixed
// list of predefined categories (e.g. "Software Engineering",
// "Data Science"). Sending free text like "MERN Developer"
// or "React" there returns irrelevant/empty results, which
// is why Muse jobs were missing before.
//
// Fix: we no longer send "category" at all. We only pass
// "location" (when provided) and let the COMBINED
// (Adzuna + Muse + Jooble) results go through
// filterRelevantJobs() in jobDiscoveryService.js, which
// already matches the query against title/description/
// company/location text. This lets Muse contribute broader
// listings that still get correctly filtered by relevance.