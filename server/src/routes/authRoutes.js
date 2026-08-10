// backend/src/routes/authRoutes.js

import express from "express";

import {
  registerUser,
  loginUser,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
const router = express.Router();

/*
 * POST /api/auth/register
 *
 * Create a new user account.
 */
router.post("/register", registerUser);

/*
 * POST /api/auth/login
 *
 * Authenticate an existing user.
 */
router.post("/login", loginUser);
router.get("/me", authenticate, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "You are authenticated",
    user: req.user,
  });
});

export default router;