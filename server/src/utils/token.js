// backend/src/utils/token.js

import jwt from "jsonwebtoken";

/*
 * Create a JWT for an authenticated user.
 */
export const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};