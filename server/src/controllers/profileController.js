// src/controllers/profileController.js

import pool from "../config/db.js";

/*
 * =========================================================
 * GET PROFILE
 * =========================================================
 *
 * GET /api/profile
 */

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
      SELECT
        id,
        user_id,
        full_name,
        headline,
        bio,
        experience_level,
        years_of_experience,
        preferred_location,
        preferred_job_type,
        preferred_work_mode,
        skills,
        preferred_roles,
        preferred_technologies,
        created_at,
        updated_at,
        preferred_location_details
      FROM user_profiles
      WHERE user_id = $1;
      `,
      [userId]
    );

    /*
     * Profile does not exist yet.
     */

    if (result.rows.length === 0) {
      return res.status(200).json({
        profile: null,
      });
    }

    return res.status(200).json({
      profile: result.rows[0],
    });

  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      message: "Unable to fetch profile",
    });
  }
};


/*
 * =========================================================
 * CREATE / UPDATE PROFILE
 * =========================================================
 *
 * PUT /api/profile
 */

export const upsertProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      full_name,
      headline,
      bio,
      experience_level,
      years_of_experience,
      preferred_location,
      preferred_location_details,
      preferred_job_type,
      preferred_work_mode,
      skills,
      preferred_roles,
      preferred_technologies,
    } = req.body;


    /*
     * -------------------------------------------------------
     * Validation
     * -------------------------------------------------------
     */

    if (!full_name) {
      return res.status(400).json({
        message: "Full name is required",
      });
    }


    /*
     * -------------------------------------------------------
     * Insert or Update
     * -------------------------------------------------------
     */

    const result = await pool.query(
      `
      INSERT INTO user_profiles (
        user_id,
        full_name,
        headline,
        bio,
        experience_level,
        years_of_experience,
        preferred_location,
        preferred_location_details,
        preferred_job_type,
        preferred_work_mode,
        skills,
        preferred_roles,
        preferred_technologies
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
        $10,
        $11,
        $12,
        $13
      )

      ON CONFLICT (user_id)

      DO UPDATE SET
        full_name = EXCLUDED.full_name,
        headline = EXCLUDED.headline,
        bio = EXCLUDED.bio,
        experience_level = EXCLUDED.experience_level,
        years_of_experience = EXCLUDED.years_of_experience,
        preferred_location = EXCLUDED.preferred_location,
        preferred_location_details = EXCLUDED.preferred_location_details,
        preferred_job_type = EXCLUDED.preferred_job_type,
        preferred_work_mode = EXCLUDED.preferred_work_mode,
        skills = EXCLUDED.skills,
        preferred_roles = EXCLUDED.preferred_roles,
        preferred_technologies = EXCLUDED.preferred_technologies,
        updated_at = CURRENT_TIMESTAMP

      RETURNING *;
      `,
      [
        userId,
        full_name,
        headline || null,
        bio || null,
        experience_level || null,
        years_of_experience || 0,
        preferred_location || null,
        preferred_location_details
          ? JSON.stringify(preferred_location_details)
          : null,
        preferred_job_type || null,
        preferred_work_mode || null,
        skills || [],
        preferred_roles || [],
        preferred_technologies || [],
      ]
    );


    return res.status(200).json({
      message: "Profile saved successfully",
      profile: result.rows[0],
    });

  } catch (error) {
    console.error("Save profile error:", error);

    return res.status(500).json({
      message: "Unable to save profile",
    });
  }
};