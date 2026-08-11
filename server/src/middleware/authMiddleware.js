// src/middleware/authMiddleware.js

import jwt from "jsonwebtoken";

/*
 * =========================================================
 * Authentication Middleware
 * =========================================================
 *
 * This middleware protects backend routes by verifying
 * the JWT sent by the frontend.
 *
 * Expected request header:
 *
 * Authorization: Bearer <JWT>
 *
 * If the token is valid:
 *
 * req.user = decoded token data
 *
 * If the token is missing or invalid:
 *
 * 401 Unauthorized
 */

export const authMiddleware = (req, res, next) => {
  try {
    /*
     * -------------------------------------------------------
     * Get Authorization Header
     * -------------------------------------------------------
     */

    const authHeader = req.headers.authorization;


    /*
     * -------------------------------------------------------
     * Check if Authorization Header Exists
     * -------------------------------------------------------
     */

    if (!authHeader) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }


    /*
     * -------------------------------------------------------
     * Check Bearer Format
     * -------------------------------------------------------
     *
     * Expected:
     *
     * Bearer eyJhbGciOi...
     *
     */

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }


    /*
     * -------------------------------------------------------
     * Extract JWT
     * -------------------------------------------------------
     *
     * Example:
     *
     * "Bearer abc123"
     *
     * becomes:
     *
     * "abc123"
     */

    const token = authHeader.split(" ")[1];


    /*
     * -------------------------------------------------------
     * Verify JWT
     * -------------------------------------------------------
     *
     * JWT_SECRET must be the same secret used when
     * the token was created during login.
     */

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );


    /*
     * -------------------------------------------------------
     * Attach User Information to Request
     * -------------------------------------------------------
     *
     * The controller can now access:
     *
     * req.user
     */

    req.user = decoded;


    /*
     * -------------------------------------------------------
     * Continue to Controller
     * -------------------------------------------------------
     */

    next();

  } catch (error) {

    console.error("JWT authentication error:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};