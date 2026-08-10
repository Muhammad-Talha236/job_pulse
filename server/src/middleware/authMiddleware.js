// backend/src/middleware/authMiddleware.js

import jwt from "jsonwebtoken";

/*
 * ---------------------------------------------------------
 * Authentication Middleware
 * ---------------------------------------------------------
 *
 * Protects routes that require a logged-in user.
 *
 * Expected header:
 *
 * Authorization: Bearer <JWT>
 */
export const authenticate = (req, res, next) => {
  try {
    /*
     * -----------------------------------------------------
     * 1. Get Authorization header
     * -----------------------------------------------------
     */
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    /*
     * -----------------------------------------------------
     * 2. Check Bearer format
     * -----------------------------------------------------
     *
     * Expected:
     *
     * Bearer eyJhbGciOiJIUzI1Ni...
     */
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    /*
     * -----------------------------------------------------
     * 3. Extract token
     * -----------------------------------------------------
     */
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing",
      });
    }

    /*
     * -----------------------------------------------------
     * 4. Verify JWT
     * -----------------------------------------------------
     */
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    /*
     * -----------------------------------------------------
     * 5. Attach user information to request
     * -----------------------------------------------------
     */
    req.user = {
      id: decoded.userId,
    };

    /*
     * -----------------------------------------------------
     * 6. Continue to controller
     * -----------------------------------------------------
     */
    next();

  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};