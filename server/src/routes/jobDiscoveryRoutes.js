import express from "express";

import {
  searchJobs,
  getRecommendedJobs,
} from "../controllers/jobDiscoveryController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/search",
  authMiddleware,
  searchJobs
);

router.get(
  "/recommended",
  authMiddleware,
  getRecommendedJobs
);

export default router;