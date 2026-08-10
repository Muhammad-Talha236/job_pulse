// frontend/src/api/authApi.js

import axios from "axios";

/*
 * ---------------------------------------------------------
 * API Base URL
 * ---------------------------------------------------------
 *
 * During local development our backend runs on port 5000.
 */
const API_BASE_URL = "http://localhost:5000/api";

/*
 * ---------------------------------------------------------
 * Register User
 * ---------------------------------------------------------
 *
 * Sends registration data to the backend.
 */
export const registerUser = async (userData) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/register`,
    userData
  );

  if (response.data.success) {
    return response.data;
  } else {
    throw new Error(response.data.message);
  }
};