// backend/src/controllers/authController.js

import pool from "../config/db.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/token.js";

/*
 * ---------------------------------------------------------
 * Register User
 * ---------------------------------------------------------
 *
 * POST /api/auth/register
 */
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    /*
     * Basic validation
     */
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    /*
     * Normalize input
     */
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    /*
     * Check duplicate email
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
     * Hash password
     */
    const passwordHash = await hashPassword(password);

    /*
     * Create user
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

    const user = result.rows[0];

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user,
    });

  } catch (error) {
    console.error("Register user error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the account",
    });
  }
};


/*
 * ---------------------------------------------------------
 * Login User
 * ---------------------------------------------------------
 *
 * POST /api/auth/login
 */
export const loginUser = async (req, res) => {
  try {
    /*
     * -----------------------------------------------------
     * 1. Get credentials from request
     * -----------------------------------------------------
     */
    const {
      email,
      password,
    } = req.body;

    /*
     * -----------------------------------------------------
     * 2. Validate input
     * -----------------------------------------------------
     */
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    /*
     * -----------------------------------------------------
     * 3. Normalize email
     * -----------------------------------------------------
     */
    const normalizedEmail = email.trim().toLowerCase();

    /*
     * -----------------------------------------------------
     * 4. Find user
     * -----------------------------------------------------
     */
    const result = await pool.query(
      `
        SELECT
          id,
          name,
          email,
          password_hash
        FROM users
        WHERE email = $1
      `,
      [normalizedEmail]
    );

    /*
     * -----------------------------------------------------
     * 5. Check whether user exists
     * -----------------------------------------------------
     */
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    /*
     * -----------------------------------------------------
     * 6. Compare password
     * -----------------------------------------------------
     */
    const passwordMatches = await comparePassword(
      password,
      user.password_hash
    );

    /*
     * Password doesn't match
     */
    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    /*
     * -----------------------------------------------------
     * 7. Generate JWT
     * -----------------------------------------------------
     */
    const token = generateToken(user.id);

    /*
     * -----------------------------------------------------
     * 8. Remove password hash from user object
     * -----------------------------------------------------
     */
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    /*
     * -----------------------------------------------------
     * 9. Send successful response
     * -----------------------------------------------------
     */
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: safeUser,
    });

  } catch (error) {
    console.error("Login user error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while logging in",
    });
  }
};

// Get currently authenticated user
export const getCurrentUser = async (req, res) => {
  try {
    /*
     * authMiddleware already verified the JWT
     * and attached the decoded information to req.user.
     */

    return res.status(200).json({
      user: req.user,
    });

  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      message: "Unable to get current user",
    });
  }
};