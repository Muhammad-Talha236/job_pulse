// src/routes/authRoutes.js

import express from "express";

import {
  registerUser as register,
  loginUser as login,
  getCurrentUser,
} from "../controllers/authController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
 * ---------------------------------------------------------
 * Public Routes
 * ---------------------------------------------------------
 *
 * These routes do NOT require authentication.
 */

// Register
router.post("/register", register);

// Login
router.post("/login", login);


/*
 * ---------------------------------------------------------
 * Protected Routes
 * ---------------------------------------------------------
 *
 * These routes require a valid JWT.
 */

// Get currently authenticated user
router.get("/me", authMiddleware, getCurrentUser);


export default router;