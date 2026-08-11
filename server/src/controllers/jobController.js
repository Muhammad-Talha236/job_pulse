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