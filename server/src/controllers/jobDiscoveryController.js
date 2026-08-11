import { discoverJobs } from "../services/jobs/jobDiscoveryService.js";
import {
  getRecommendedJobs as generateRecommendedJobs,
} from "../services/jobs/jobRecommendationService.js";
import pool from "../config/db.js";
export const searchJobs = async (req, res) => {
  try {
    const {
      query,
      location,
      page = 1,
    } = req.query;

    if (!query?.trim()) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const data = await discoverJobs({
      query: query.trim(),
      location: location?.trim(),
      page: Number(page),
    });

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
// GET RECOMMENDED JOBS
// =========================================================
// GET /api/job-discovery/recommended

export const getRecommendedJobs = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
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

    const profile = result.rows[0];

    const data = await generateRecommendedJobs(
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