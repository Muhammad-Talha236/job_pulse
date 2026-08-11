import express from "express";

import {
  searchJobs,
} from "../controllers/jobDiscoveryController.js";

import {
  authMiddleware,
} from "../middleware/authMiddleware.js";


const router = express.Router();


router.get(
  "/search",
  authMiddleware,
  searchJobs
);


export default router;