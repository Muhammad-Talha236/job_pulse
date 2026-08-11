// src/routes/jobRoutes.js

import express from "express";

import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router();


/*
 * =========================================================
 * CREATE JOB
 * =========================================================
 *
 * POST /api/jobs
 */

router.post(
  "/",
  authMiddleware,
  createJob
);


/*
 * =========================================================
 * GET ALL JOBS
 * =========================================================
 *
 * GET /api/jobs
 */

router.get(
  "/",
  authMiddleware,
  getJobs
);


/*
 * =========================================================
 * GET SINGLE JOB
 * =========================================================
 *
 * GET /api/jobs/:id
 */

router.get(
  "/:id",
  authMiddleware,
  getJobById
);


/*
 * =========================================================
 * UPDATE JOB
 * =========================================================
 *
 * PUT /api/jobs/:id
 */

router.put(
  "/:id",
  authMiddleware,
  updateJob
);


/*
 * =========================================================
 * DELETE JOB
 * =========================================================
 *
 * DELETE /api/jobs/:id
 */

router.delete(
  "/:id",
  authMiddleware,
  deleteJob
);


export default router;