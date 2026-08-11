// src/api/jobsApi.js

import axiosClient from "./axiosClient";

/*
 * =========================================================
 * SAVED JOBS
 * =========================================================
 */

/**
 * Save a discovered job
 */
export const saveJob = async (job) => {
  const response = await axiosClient.post("/jobs/save", {
    title: job.title,
    company: job.company,
    location: job.location,
    description: job.description,
    url: job.url,
    source: job.source,
    salary:
      job.salaryMin != null && job.salaryMax != null
        ? `${job.salaryMin} - ${job.salaryMax}`
        : null,
    job_type: job.contractType || null,
  });

  return response.data;
};

/**
 * Remove a saved job
 */
export const unsaveJob = async (job) => {
  const response = await axiosClient.delete("/jobs/save", {
    data: {
      title: job.title,
      company: job.company,
      url: job.url,
    },
  });

  return response.data;
};

/**
 * Get user's saved jobs
 */
export const getSavedJobs = async () => {
  const response = await axiosClient.get("/jobs/saved");

  return response.data;
};

/*
 * =========================================================
 * USER JOBS
 * =========================================================
 */

/**
 * Get all jobs belonging to the authenticated user
 *
 * GET /api/jobs
 */
export const getJobs = async () => {
  const response = await axiosClient.get("/jobs");

  return response.data;
};

/*
 * =========================================================
 * GET SINGLE JOB
 * =========================================================
 */

/**
 * GET /api/jobs/:id
 */
export const getJobById = async (id) => {
  const response = await axiosClient.get(`/jobs/${id}`);

  return response.data;
};

/*
 * =========================================================
 * CREATE JOB
 * =========================================================
 */

/**
 * POST /api/jobs
 */
export const createJob = async (jobData) => {
  const response = await axiosClient.post("/jobs", jobData);

  return response.data;
};

/*
 * =========================================================
 * UPDATE JOB
 * =========================================================
 */

/**
 * PUT /api/jobs/:id
 */
export const updateJob = async (id, jobData) => {
  const response = await axiosClient.put(`/jobs/${id}`, jobData);

  return response.data;
};

/*
 * =========================================================
 * DELETE JOB
 * =========================================================
 */

/**
 * DELETE /api/jobs/:id
 */
export const deleteJob = async (id) => {
  const response = await axiosClient.delete(`/jobs/${id}`);

  return response.data;
};