import axios from "axios";

const API_URL =
  "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

/*
 * =========================================================
 * SEARCH JOBS
 * =========================================================
 */

export const searchJobs = async (
  query,
  location = "",
  page = 1
) => {
  const response = await axios.get(
    `${API_URL}/job-discovery/search`,
    {
      params: {
        query,
        ...(location && { location }),
        page,
      },

      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

/*
 * =========================================================
 * GET RECOMMENDED JOBS
 * =========================================================
 *
 * Uses the logged-in user's profile on backend.
 *
 * The backend gets:
 *
 * req.user.userId
 *       ↓
 * user_profiles
 *       ↓
 * skills
 *       ↓
 * recommendation search
 */

export const getRecommendedJobs = async () => {
  const response = await axios.get(
    `${API_URL}/job-discovery/recommended`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

/*
 * =========================================================
 * GET JOB SUGGESTIONS (autocomplete)
 * =========================================================
 *
 * Used by the search bar's skill/location suggestion
 * dropdown (useJobSuggestions hook).
 *
 * type: "skill" | "location"
 * query: the partial text the user has typed
 *
 * Backend route:
 * GET /api/job-discovery/suggestions?type=skill&q=react
 */

export const getJobSuggestions = async (
  type,
  query
) => {
  const response = await axios.get(
    `${API_URL}/job-discovery/suggestions`,
    {
      params: {
        type,
        q: query,
      },

      headers: getAuthHeaders(),
    }
  );

  return response.data;
};