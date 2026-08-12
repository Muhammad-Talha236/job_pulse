// backend/src/services/jobs/joobleService.js
import axios from "axios";

const JOOBLE_BASE_URL = "https://jooble.org/api";
const MAX_RETRIES = 3;

export const searchJoobleJobs = async ({ query, location, page = 1 }) => {
  const apiKey = process.env.JOOBLE_API_KEY;
  console.log("Jooble API Key status:", apiKey ? "Present" : "Missing"); // <-- Yeh add karein
  if (!apiKey) {
    console.warn("Jooble API key is not configured");
    return { jobs: [], totalCount: 0 };
  }

  const searchLocation = location || "Pakistan";

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Endpoint URL structure: https://jooble.org/api/{apiKey}
      const response = await axios.post(`${JOOBLE_BASE_URL}/${apiKey}`, {
        keywords: query,
        location: searchLocation,
        page: page,
        resultonpage: 20,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      });

      return response.data;
    } catch (error) {
      console.error(`Jooble attempt ${attempt} failed:`, error.response?.status, error.message);
      if (attempt === MAX_RETRIES) {
        throw new Error("Unable to fetch jobs from Jooble");
      }
      await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
    }
  }
};