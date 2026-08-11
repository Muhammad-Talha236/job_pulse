// src/api/authApi.js

import axiosClient from "./axiosClient";

/*
 * ---------------------------------------------------------
 * Register User
 * ---------------------------------------------------------
 *
 * Sends registration information to the backend.
 */
export const registerUser = async (userData) => {
  const response = await axiosClient.post(
    "/auth/register",
    userData
  );

  return response.data;
};


/*
 * ---------------------------------------------------------
 * Login User
 * ---------------------------------------------------------
 *
 * Sends login credentials to the backend.
 */
export const loginUser = async (credentials) => {
  const response = await axiosClient.post(
    "/auth/login",
    credentials
  );

  return response.data;
};