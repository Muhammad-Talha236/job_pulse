// src/controllers/jobController.js

import pool from "../config/db.js";

/*
 * =========================================================
 * CREATE JOB
 * =========================================================
 *
 * POST /api/jobs
 */

export const createJob = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      title,
      company,
      location,
      description,
      url,
      source,
      salary,
      job_type,
      status,
    } = req.body;

    if (!title || !company) {
      return res.status(400).json({
        message: "Job title and company are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO jobs (
        user_id,
        title,
        company,
        location,
        description,
        url,
        source,
        salary,
        job_type,
        status
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        COALESCE($10, 'discovered')
      )
      RETURNING *;
      `,
      [
        userId,
        title,
        company,
        location || null,
        description || null,
        url || null,
        source || null,
        salary || null,
        job_type || null,
        status || null,
      ]
    );

    return res.status(201).json({
      message: "Job created successfully",
      job: result.rows[0],
    });

  } catch (error) {
    console.error("Create job error:", error);

    return res.status(500).json({
      message: "Unable to create job",
    });
  }
};


/*
 * =========================================================
 * GET ALL USER JOBS
 * =========================================================
 *
 * GET /api/jobs
 */

export const getJobs = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
      SELECT *
      FROM jobs
      WHERE user_id = $1
      ORDER BY created_at DESC;
      `,
      [userId]
    );

    return res.status(200).json({
      jobs: result.rows,
    });

  } catch (error) {
    console.error("Get jobs error:", error);

    return res.status(500).json({
      message: "Unable to fetch jobs",
    });
  }
};


/*
 * =========================================================
 * GET SINGLE JOB
 * =========================================================
 *
 * GET /api/jobs/:id
 */

export const getJobById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM jobs
      WHERE id = $1
      AND user_id = $2;
      `,
      [id, userId]
    );

    /*
     * If no row was returned:
     *
     * - Job doesn't exist
     * OR
     * - Job belongs to another user
     */

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    return res.status(200).json({
      job: result.rows[0],
    });

  } catch (error) {
    console.error("Get job error:", error);

    return res.status(500).json({
      message: "Unable to fetch job",
    });
  }
};


/*
 * =========================================================
 * UPDATE JOB
 * =========================================================
 *
 * PUT /api/jobs/:id
 */

export const updateJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const {
      title,
      company,
      location,
      description,
      url,
      source,
      salary,
      job_type,
      status,
    } = req.body;

    if (!title || !company) {
      return res.status(400).json({
        message: "Job title and company are required",
      });
    }

    const result = await pool.query(
      `
      UPDATE jobs
      SET
        title = $1,
        company = $2,
        location = $3,
        description = $4,
        url = $5,
        source = $6,
        salary = $7,
        job_type = $8,
        status = $9,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      AND user_id = $11
      RETURNING *;
      `,
      [
        title,
        company,
        location || null,
        description || null,
        url || null,
        source || null,
        salary || null,
        job_type || null,
        status || "discovered",
        id,
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    return res.status(200).json({
      message: "Job updated successfully",
      job: result.rows[0],
    });

  } catch (error) {
    console.error("Update job error:", error);

    return res.status(500).json({
      message: "Unable to update job",
    });
  }
};


/*
 * =========================================================
 * DELETE JOB
 * =========================================================
 *
 * DELETE /api/jobs/:id
 */

export const deleteJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM jobs
      WHERE id = $1
      AND user_id = $2
      RETURNING *;
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    return res.status(200).json({
      message: "Job deleted successfully",
    });

  } catch (error) {
    console.error("Delete job error:", error);

    return res.status(500).json({
      message: "Unable to delete job",
    });
  }
};

// =========================================================
// SAVE JOB
// =========================================================
// POST /api/jobs/save

export const saveJob = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      title,
      company,
      location,
      description,
      url,
      source,
      salary,
      job_type,
    } = req.body;

    if (!title || !company) {
      return res.status(400).json({
        message: "Job title and company are required",
      });
    }

    // Prevent duplicate saved jobs for same user
    const existingJob = await pool.query(
      `
      SELECT *
      FROM jobs
      WHERE user_id = $1
      AND title = $2
      AND company = $3
      AND COALESCE(url, '') = COALESCE($4, '')
      LIMIT 1;
      `,
      [userId, title, company, url || null]
    );

    if (existingJob.rows.length > 0) {
      return res.status(200).json({
        message: "Job already saved",
        job: existingJob.rows[0],
        alreadySaved: true,
      });
    }

    const result = await pool.query(
      `
      INSERT INTO jobs (
        user_id,
        title,
        company,
        location,
        description,
        url,
        source,
        salary,
        job_type,
        status
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        'saved'
      )
      RETURNING *;
      `,
      [
        userId,
        title,
        company,
        location || null,
        description || null,
        url || null,
        source || null,
        salary || null,
        job_type || null,
      ]
    );

    return res.status(201).json({
      message: "Job saved successfully",
      job: result.rows[0],
      alreadySaved: false,
    });
  } catch (error) {
    console.error("Save job error:", error);

    return res.status(500).json({
      message: "Unable to save job",
    });
  }
};

// =========================================================
// UNSAVE JOB
// =========================================================
// DELETE /api/jobs/save

export const unsaveJob = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { title, company, url } = req.body;

    const result = await pool.query(
      `
      DELETE FROM jobs
      WHERE user_id = $1
      AND title = $2
      AND company = $3
      AND COALESCE(url, '') = COALESCE($4, '')
      AND status = 'saved'
      RETURNING *;
      `,
      [userId, title, company, url || null]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Saved job not found",
      });
    }

    return res.status(200).json({
      message: "Job removed from saved jobs",
      job: result.rows[0],
    });
  } catch (error) {
    console.error("Unsave job error:", error);

    return res.status(500).json({
      message: "Unable to remove saved job",
    });
  }
};

// =========================================================
// GET SAVED JOBS
// =========================================================
// GET /api/jobs/saved

export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
      SELECT *
      FROM jobs
      WHERE user_id = $1
      AND status = 'saved'
      ORDER BY created_at DESC;
      `,
      [userId]
    );

    return res.status(200).json({
      jobs: result.rows,
    });
  } catch (error) {
    console.error("Get saved jobs error:", error);

    return res.status(500).json({
      message: "Unable to fetch saved jobs",
    });
  }
};

// =========================================================
// GET RECOMMENDED JOBS
// =========================================================
// GET /api/jobs/recommended

export const getRecommendedJobs = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user's profile
    const profileResult = await pool.query(
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

    if (profileResult.rows.length === 0) {
      return res.status(200).json({
        jobs: [],
        message: "Complete your profile to get personalized job recommendations.",
      });
    }

    const profile = profileResult.rows[0];

    const skills = profile.skills || [];
    const preferredRoles = profile.preferred_roles || [];
    const technologies = profile.preferred_technologies || [];

    // Nothing to match against
    if (
      skills.length === 0 &&
      preferredRoles.length === 0 &&
      technologies.length === 0
    ) {
      return res.status(200).json({
        jobs: [],
        message: "Add skills or preferred roles to your profile.",
      });
    }

    /*
     * Build searchable terms.
     *
     * We use PostgreSQL ILIKE so matching remains
     * case-insensitive.
     */
    const searchTerms = [
      ...skills,
      ...preferredRoles,
      ...technologies,
    ]
      .filter(Boolean)
      .map((item) => item.trim())
      .filter(Boolean);

    if (searchTerms.length === 0) {
      return res.status(200).json({
        jobs: [],
      });
    }

    /*
     * Search jobs against:
     * - title
     * - company
     * - description
     * - job type
     * - location
     *
     * Each matching term contributes to the score.
     */
    const result = await pool.query(
      `
      SELECT
        j.*,

        (
          SELECT COUNT(*)
          FROM unnest($2::text[]) AS term
          WHERE
            j.title ILIKE '%' || term || '%'
            OR j.description ILIKE '%' || term || '%'
            OR j.company ILIKE '%' || term || '%'
            OR j.job_type ILIKE '%' || term || '%'
        ) AS match_count

      FROM jobs j

      WHERE
        j.user_id = $1

      ORDER BY
        match_count DESC,
        j.created_at DESC

      LIMIT 10;
      `,
      [userId, searchTerms]
    );

    return res.status(200).json({
      jobs: result.rows,
      profile: {
        skills,
        preferredRoles,
        technologies,
        preferredLocation: profile.preferred_location,
      },
    });
  } catch (error) {
    console.error("Get recommended jobs error:", error);

    return res.status(500).json({
      message: "Unable to fetch recommended jobs",
    });
  }
};