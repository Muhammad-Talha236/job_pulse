import axios from "axios";

const API_URL =
  "http://localhost:5000/api";

export const searchJobs = async (
  query,
  location = "",
  page = 1
) => {
  const token =
    localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/job-discovery/search`,
    {
      params: {
        query,
        ...(location && { location }),
        page,
      },

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getRecommendedJobs = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/job-discovery/recommended`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};