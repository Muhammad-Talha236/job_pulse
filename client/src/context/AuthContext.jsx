// src/context/AuthContext.jsx

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  registerUser,
} from "../api/authApi";

import axiosClient from "../api/axiosClient";


/*
 * =========================================================
 * Auth Context
 * =========================================================
 */

const AuthContext = createContext(null);


/*
 * =========================================================
 * Auth Provider
 * =========================================================
 */

export function AuthProvider({ children }) {

  /*
   * -------------------------------------------------------
   * User State
   * -------------------------------------------------------
   *
   * Stores the currently authenticated user.
   */

  const [user, setUser] = useState(null);


  /*
   * -------------------------------------------------------
   * Loading State
   * -------------------------------------------------------
   *
   * Important during application startup.
   *
   * While this is true, we are checking whether the user
   * already has a valid session.
   */

  const [loading, setLoading] = useState(true);


  /*
   * -------------------------------------------------------
   * Restore Authentication
   * -------------------------------------------------------
   *
   * Runs once when AuthProvider is mounted.
   */

  useEffect(() => {

    const restoreSession = async () => {

      try {

        /*
         * Check whether a JWT exists.
         */

        const token = localStorage.getItem("token");


        /*
         * No token means there is no session to restore.
         */

        if (!token) {
          setUser(null);
          return;
        }


        /*
         * Ask the backend who this token belongs to.
         *
         * axiosClient automatically adds:
         *
         * Authorization: Bearer <token>
         */

        const response = await axiosClient.get(
          "/auth/me"
        );


        /*
         * Backend returns:
         *
         * {
         *   user: {...}
         * }
         */

        setUser(response.data.user);

      } catch (error) {

        /*
         * If the token is invalid or expired,
         * remove it from localStorage.
         */

        console.error(
          "Session restoration failed:",
          error
        );

        localStorage.removeItem("token");

        setUser(null);

      } finally {

        /*
         * Authentication check is finished.
         */

        setLoading(false);
      }
    };


    restoreSession();

  }, []);


  /*
   * -------------------------------------------------------
   * Login
   * -------------------------------------------------------
   */

  const login = async (credentials) => {

    const response = await loginUser(credentials);


    /*
     * Store JWT.
     *
     * Adjust this if your backend returns the token
     * using a different property name.
     */

    const token = response.token;

    localStorage.setItem(
      "token",
      token
    );


    /*
     * Store user information.
     */

    setUser(response.user);


    return response;
  };


  /*
   * -------------------------------------------------------
   * Register
   * -------------------------------------------------------
   */

  const register = async (userData) => {

    const response = await registerUser(userData);

    return response;
  };


  /*
   * -------------------------------------------------------
   * Logout
   * -------------------------------------------------------
   */

  const logout = () => {

    /*
     * Remove JWT.
     */

    localStorage.removeItem("token");


    /*
     * Remove user from React state.
     */

    setUser(null);
  };


  /*
   * -------------------------------------------------------
   * Authentication Status
   * -------------------------------------------------------
   */

  const isAuthenticated = Boolean(user);


  /*
   * -------------------------------------------------------
   * Context Value
   * -------------------------------------------------------
   */

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


/*
 * =========================================================
 * useAuth Hook
 * =========================================================
 *
 * Components can use:
 *
 * const { user, login, logout } = useAuth();
 */

export function useAuth() {

  const context = useContext(AuthContext);


  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }


  return context;
}