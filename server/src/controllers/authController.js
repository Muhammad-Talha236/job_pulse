// backend/src/controllers/authController.js

import pool from "../config/db.js";
import { hashPassword } from "../utils/password.js";

/*
 * ---------------------------------------------------------
 * Register User
 * ---------------------------------------------------------
 *
 * POST /api/auth/register
 *
 * Creates a new JobPulse user.
 */
export const registerUser = async (req, res) => {
  try {
    /*
     * -----------------------------------------------------
     * 1. Read data from request body
     * -----------------------------------------------------
     */
    const {
      name,
      email,
      password,
    } = req.body;

    /*
     * -----------------------------------------------------
     * 2. Basic validation
     * -----------------------------------------------------
     *
     * We don't trust data coming from the frontend.
     */
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    /*
     * -----------------------------------------------------
     * 3. Normalize input
     * -----------------------------------------------------
     *
     * Emails should be treated consistently.
     */
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    /*
     * -----------------------------------------------------
     * 4. Check whether the email already exists
     * -----------------------------------------------------
     */
    const existingUser = await pool.query(
      `
        SELECT id
        FROM users
        WHERE email = $1
      `,
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    /*
     * -----------------------------------------------------
     * 5. Hash password
     * -----------------------------------------------------
     *
     * Never store the plain-text password.
     */
    const passwordHash = await hashPassword(password);

    /*
     * -----------------------------------------------------
     * 6. Insert user into PostgreSQL
     * -----------------------------------------------------
     */
    const result = await pool.query(
      `
        INSERT INTO users (
          name,
          email,
          password_hash
        )
        VALUES ($1, $2, $3)
        RETURNING
          id,
          name,
          email,
          created_at
      `,
      [
        normalizedName,
        normalizedEmail,
        passwordHash,
      ]
    );

    /*
     * -----------------------------------------------------
     * 7. Get newly created user
     * -----------------------------------------------------
     */
    const user = result.rows[0];

    /*
     * -----------------------------------------------------
     * 8. Send successful response
     * -----------------------------------------------------
     */
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user,
    });
  } catch (error) {
    /*
     * -----------------------------------------------------
     * Unexpected server error
     * -----------------------------------------------------
     */
    console.error("Register user error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the account",
    });
  }
};