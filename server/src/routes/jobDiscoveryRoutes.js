import express from "express";

import {
  searchJobs,
  getRecommendedJobs,
  getJobSuggestions,
} from "../controllers/jobDiscoveryController.js";

import {
  authMiddleware,
} from "../middleware/authMiddleware.js";

const router =
  express.Router();

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

router.get(
  "/suggestions",
  authMiddleware,
  getJobSuggestions
);

export default router;