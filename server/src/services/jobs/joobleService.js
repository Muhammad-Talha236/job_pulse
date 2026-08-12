import axios from "axios";

const JOOBLE_BASE_URL = "https://jooble.org/api";
const MAX_RETRIES = 3;

export const searchJoobleJobs = async ({ query, location, page = 1 }) => {
  const apiKey = process.env.JOOBLE_API_KEY;
  
  console.log("Jooble API Key status:", apiKey ? "Present" : "Missing");
  
  if (!apiKey) {
    console.warn("Jooble API key is not configured");
    return { jobs: [], totalCount: 0 };
  }

  const searchLocation = location || "Pakistan";

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Jooble request attempt ${attempt}/${MAX_RETRIES} for query: "${query}" in "${searchLocation}"`);
      
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

      console.log(`Jooble request successful on attempt ${attempt}`);
      return response.data;
    } catch (error) {
      console.error(`Jooble attempt ${attempt} failed:`, error.response?.status, error.response?.data || error.message);
      
      if (attempt === MAX_RETRIES) {
        console.error("Jooble API failed after all retry attempts");
        return { jobs: [], totalCount: 0 }; // Fail gracefully so other sources (Adzuna/Muse) don't crash
      }
      
      const delay = attempt * 2000;
      console.log(`Retrying Jooble in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};