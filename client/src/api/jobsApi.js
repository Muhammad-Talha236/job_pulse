// src/api/jobsApi.js

import axiosClient from "./axiosClient";

/*
 * =========================================================
 * Get All Jobs
 * =========================================================
 */

export const getJobs = async () => {
  const response = await axiosClient.get("/jobs");

  return response.data;
};


/*
 * =========================================================
 * Get Single Job
 * =========================================================
 */

export const getJobById = async (id) => {
  const response = await axiosClient.get(`/jobs/${id}`);

  return response.data;
};


/*
 * =========================================================
 * Create Job
 * =========================================================
 */

export const createJob = async (jobData) => {
  const response = await axiosClient.post(
    "/jobs",
    jobData
  );

  return response.data;
};


/*
 * =========================================================
 * Update Job
 * =========================================================
 */

export const updateJob = async (id, jobData) => {
  const response = await axiosClient.put(
    `/jobs/${id}`,
    jobData
  );

  return response.data;
};


/*
 * =========================================================
 * Delete Job
 * =========================================================
 */

export const deleteJob = async (id) => {
  const response = await axiosClient.delete(
    `/jobs/${id}`
  );

  return response.data;
};