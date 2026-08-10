// backend/src/app.js

import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";

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
  })
);

app.use(express.json());

/*
 * ---------------------------------------------------------
 * API Routes
 * ---------------------------------------------------------
 */

app.use("/api/auth", authRoutes);

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