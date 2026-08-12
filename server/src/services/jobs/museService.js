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

            ...(query
              ? { category: query }
              : {}),

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
// The Muse's public API does not support a generic
// free-text "what" search parameter like Adzuna does.
// It only supports filtering by category, level,
// location, and company.
//
// Because of this, Muse results are NOT reliably
// filtered by keyword at the API level — the real
// keyword filtering happens in jobDiscoveryService.js
// via filterRelevantJobs(), which is applied to the
// COMBINED (Adzuna + Muse) results after normalization.
//
// If Muse keeps returning too many irrelevant jobs,
// consider dropping it from discoverJobs() for
// keyword searches and only using it for recommendation
// broadening, since Adzuna is the source that actually
// respects the "query" (what) parameter.

// const filterMuseJobs = (jobs, query) => {
//   if (!query?.trim()) {
//     return jobs;
//   }

//   const keywords = query
//     .toLowerCase()
//     .split(/\s+/)
//     .filter(Boolean);

//   return jobs.filter((job) => {
//     const searchableText = [
//       job.name,
//       job.contents,
//       ...(job.categories || []).map(
//         (category) =>
//           category?.name || ""
//       ),
//     ]
//       .join(" ")
//       .toLowerCase();

//     return keywords.some((keyword) =>
//       searchableText.includes(keyword)
//     );
//   });
// };