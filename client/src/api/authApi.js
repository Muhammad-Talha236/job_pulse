// client/src/api/authApi.js

import apiClient from "./apiClient";

/*
 * Register a new user.
 */
export const registerUser = async (userData) => {
  const response = await apiClient.post(
    "/auth/register",
    userData
  );

  return response.data;
};

/*
 * Login an existing user.
 */
export const loginUser = async (credentials) => {
  const response = await apiClient.post(
    "/auth/login",
    credentials
  );

  return response.data;
};