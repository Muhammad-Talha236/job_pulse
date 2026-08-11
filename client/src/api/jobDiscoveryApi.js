import axios from "axios";

const API_URL =
  "http://localhost:5000/api";

const getAuthConfig = () => {
  const token =
    localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// =========================================================
// SEARCH JOBS
// =========================================================

export const searchJobs = async (
  query,
  location = "",
  page = 1
) => {
  const response =
    await axios.get(
      `${API_URL}/job-discovery/search`,
      {
        params: {
          query,
          ...(location && {
            location,
          }),
          page,
        },

        ...getAuthConfig(),
      }
    );

  return response.data;
};

// =========================================================
// RECOMMENDED JOBS
// =========================================================

export const getRecommendedJobs =
  async () => {
    const response =
      await axios.get(
        `${API_URL}/job-discovery/recommended`,
        getAuthConfig()
      );

    return response.data;
  };

// =========================================================
// JOB SUGGESTIONS
// =========================================================

export const getJobSuggestions =
  async (type, q) => {
    if (
      !type ||
      !q?.trim()
    ) {
      return {
        suggestions: [],
      };
    }

    const response =
      await axios.get(
        `${API_URL}/job-discovery/suggestions`,
        {
          params: {
            type,
            q: q.trim(),
          },

          ...getAuthConfig(),
        }
      );

    return response.data;
  };