import pool from "../config/db.js";

import {
  discoverJobs,
} from "../services/jobs/jobDiscoveryService.js";

import {
  getRecommendedJobs as generateRecommendedJobs,
} from "../services/jobs/jobRecommendationService.js";

import {
  getSuggestions,
  isValidSearchQuery,
  generateJobSuggestions,
} from "../services/jobs/jobSuggestionService.js";
// =========================================================
// SEARCH JOBS
// =========================================================
// GET /api/job-discovery/search

export const searchJobs = async (req, res) => {
  try {
    const {
      query,
      location,
      page = 1,
    } = req.query;

    const cleanQuery =
      query?.trim();

    const cleanLocation =
      location?.trim() || "";

    // -----------------------------------------------------
    // Empty query
    // -----------------------------------------------------

    if (!cleanQuery) {
      return res.status(400).json({
        message:
          "Please enter a valid job title or skill.",
      });
    }

    // -----------------------------------------------------
    // Validate search query
    // -----------------------------------------------------

    if (!isValidSearchQuery(cleanQuery)) {
      return res.status(400).json({
        message:
          `"${cleanQuery}" is not a recognized skill or job title. Please select a suggestion or enter a valid skill/job role.`,
        jobs: [],
      });
    }

    // -----------------------------------------------------
    // Discover jobs
    // -----------------------------------------------------

    const data =
      await discoverJobs({
        query: cleanQuery,
        location: cleanLocation,
        page: Number(page),
      });

    // -----------------------------------------------------
    // No jobs
    // -----------------------------------------------------

    if (!data.jobs?.length) {
      return res.status(200).json({
        ...data,
        message:
          "No jobs found for this search.",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error(
      "Job discovery error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Unable to discover jobs",
    });
  }
};

// =========================================================
// SEARCH SUGGESTIONS
// =========================================================
// GET /api/job-discovery/suggestions?q=react&type=skill

export const searchSuggestions = async (
  req,
  res
) => {
  try {
    const {
      q,
      type = "skill",
    } = req.query;

    if (!q?.trim()) {
      return res.status(200).json({
        suggestions: [],
      });
    }

    const suggestions =
      getSuggestions({
        query: q.trim(),
        type,
      });

    return res.status(200).json({
      suggestions,
    });
  } catch (error) {
    console.error(
      "Suggestions error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to fetch suggestions",
    });
  }
};

// =========================================================
// GET RECOMMENDED JOBS
// =========================================================
// GET /api/job-discovery/recommended

export const getRecommendedJobs = async (
  req,
  res
) => {
  try {
    const userId =
      req.user.userId;

    const result =
      await pool.query(
        `
        SELECT
          skills,
          preferred_roles,
          preferred_technologies,
          preferred_location,
          preferred_job_type,
          preferred_work_mode
        FROM user_profiles
        WHERE user_id = $1;
        `,
        [userId]
      );

    if (result.rows.length === 0) {
      return res.status(200).json({
        jobs: [],
        message:
          "Complete your profile to get personalized job recommendations.",
      });
    }

    const profile =
      result.rows[0];

    const data =
      await generateRecommendedJobs(
        profile
      );

    return res.status(200).json(data);
  } catch (error) {
    console.error(
      "Recommended jobs error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to generate job recommendations",
    });
  }
};

export const getJobSuggestions =
  async (req, res) => {
    try {
      const type = String(
        req.query.type || ""
      )
        .trim()
        .toLowerCase();

      const q = String(
        req.query.q || ""
      ).trim();

      if (
        !["skill", "location"].includes(
          type
        )
      ) {
        return res
          .status(400)
          .json({
            message:
              "Suggestion type must be skill or location",
          });
      }

      if (q.length < 2) {
        return res
          .status(200)
          .json({
            suggestions: [],
          });
      }

      const data =
        await generateJobSuggestions({
          type,
          query: q,
        });

      return res
        .status(200)
        .json(data);
    } catch (error) {
      console.error(
        "Job suggestions error:",
        error
      );

      return res
        .status(500)
        .json({
          message:
            "Unable to load job suggestions",
        });
    }
  };