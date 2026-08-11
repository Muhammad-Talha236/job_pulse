import "dotenv/config";
import axios from "axios";

const url =
  "https://api.adzuna.com/v1/api/jobs/gb/search/1";

try {
  console.log("Testing Adzuna from Node...");

  const response = await axios.get(url, {
    params: {
      app_id: process.env.ADZUNA_APP_ID,
      app_key: process.env.ADZUNA_APP_KEY,
      "content-type": "application/json",
      results_per_page: 20,
      what: "MERN Developer",
    },

    headers: {
      Accept: "application/json",
    },

    timeout: 60000,
  });

  console.log("SUCCESS");
  console.log("Status:", response.status);
  console.log("Jobs:", response.data.results?.length);

  console.log(
    response.data.results?.[0]
  );
} catch (error) {
  console.error("FAILED");
  console.error("Code:", error.code);
  console.error("Message:", error.message);
  console.error("Status:", error.response?.status);
  console.error("Response:", error.response?.data);
}