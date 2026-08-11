// backend/src/app.js

import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

import jobDiscoveryRoutes from "./routes/jobDiscoveryRoutes.js";

const app = express();

/*
 * ---------------------------------------------------------
 * Global Middleware
 * ---------------------------------------------------------
 */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

/*
 * ---------------------------------------------------------
 * API Routes
 * ---------------------------------------------------------
 */

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/job-discovery", jobDiscoveryRoutes);
/*
 * ---------------------------------------------------------
 * Health Check
 * ---------------------------------------------------------
 */

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "JobPulse API is running",
  });
});

export default app;
