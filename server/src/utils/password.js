// backend/src/utils/password.js

import bcrypt from "bcrypt";

/*
 * ---------------------------------------------------------
 * Configuration
 * ---------------------------------------------------------
 *
 * The salt rounds control how computationally expensive
 * bcrypt hashing should be.
 *
 * Higher values = more computational work.
 *
 * 12 is a reasonable starting point for our project.
 */
const SALT_ROUNDS = 12;

/*
 * ---------------------------------------------------------
 * Hash Password
 * ---------------------------------------------------------
 *
 * Takes a plain-text password and returns a bcrypt hash.
 */
export const hashPassword = async (password) => {
  if (!password) {
    throw new Error("Password is required");
  }

  const passwordHash = await bcrypt.hash(
    password,
    SALT_ROUNDS
  );

  return passwordHash;
};

/*
 * ---------------------------------------------------------
 * Compare Password
 * ---------------------------------------------------------
 *
 * Compares a plain-text password with a stored bcrypt hash.
 *
 * Returns:
 * true  → password matches
 * false → password does not match
 */
export const comparePassword = async (
  password,
  passwordHash
) => {
  if (!password || !passwordHash) {
    return false;
  }

  return bcrypt.compare(password, passwordHash);
};