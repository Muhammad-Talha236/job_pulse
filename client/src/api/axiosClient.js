// src/api/axiosClient.js

import axios from "axios";

/*
 * ---------------------------------------------------------
 * Axios Client
 * ---------------------------------------------------------
 *
 * This is our centralized HTTP client.
 *
 * Instead of importing axios directly in every API file,
 * we'll use this configured instance.
 */

const axiosClient = axios.create({
  /*
   * Backend API URL.
   *
   * Vite exposes environment variables that start with
   * VITE_ to the frontend.
   *
   * Example:
   *
   * VITE_API_URL=http://localhost:5000/api
   */
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",

  /*
   * Maximum time Axios will wait for a response.
   */
  timeout: 10000,

  /*
   * Default headers sent with requests.
   */
  headers: {
    "Content-Type": "application/json",
  },
});


/*
 * ---------------------------------------------------------
 * Request Interceptor
 * ---------------------------------------------------------
 *
 * This function runs BEFORE every request.
 *
 * We use it to automatically attach the JWT.
 */
axiosClient.interceptors.request.use(
  (config) => {
    /*
     * Get the token stored during login.
     */
    const token = localStorage.getItem("token");

    /*
     * If a token exists, attach it to the request.
     *
     * Backend will receive:
     *
     * Authorization: Bearer <token>
     */
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    /*
     * Something went wrong before the request
     * was sent.
     */
    return Promise.reject(error);
  }
);


/*
 * ---------------------------------------------------------
 * Response Interceptor
 * ---------------------------------------------------------
 *
 * This runs after the backend responds.
 *
 * For now, we simply return the response.
 *
 * Later we can use this to handle:
 *
 * 401 Unauthorized
 * token expiration
 * automatic logout
 * global API errors
 */
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    return Promise.reject(error);
  }
);


export default axiosClient;