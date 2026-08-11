// src/api/profileApi.js

import axios from "axios";

const API_URL = "http://localhost:5000/api/profile";


/*
 * Get current user's profile
 */

export const getProfile = async () => {

  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


/*
 * Create / update current user's profile
 */

export const saveProfile = async (data) => {

  const token = localStorage.getItem("token");

  const response = await axios.put(
    API_URL,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};