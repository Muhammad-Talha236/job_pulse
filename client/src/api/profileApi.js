// src/api/profileApi.js

import axiosClient from "./axiosClient";

/*
 * Get current user's profile
 */
export const getProfile = async () => {
  const response = await axiosClient.get("/profile");

  return response.data;
};

/*
 * Create / update current user's profile
 */
export const saveProfile = async (data) => {
  const response = await axiosClient.put("/profile", data);

  return response.data;
};