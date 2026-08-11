// src/routes/profileRoutes.js

import express from "express";

import {
  getProfile,
  upsertProfile,
} from "../controllers/profileController.js";

import {
  authMiddleware,
} from "../middleware/authMiddleware.js";


const router = express.Router();


/*
 * =========================================================
 * GET PROFILE
 * =========================================================
 *
 * GET /api/profile
 */

router.get(
  "/",
  authMiddleware,
  getProfile
);


/*
 * =========================================================
 * SAVE PROFILE
 * =========================================================
 *
 * PUT /api/profile
 */

router.put(
  "/",
  authMiddleware,
  upsertProfile
);


export default router;