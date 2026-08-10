// backend/src/routes/authRoutes.js

import express from "express";

import { registerUser } from "../controllers/authController.js";

const router = express.Router();

/*
 * POST /api/auth/register
 *
 * Register a new JobPulse user.
 */
router.post("/register", registerUser);

export default router;