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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
   * -------------------------------------------------------
   * Restore Authentication
   * -------------------------------------------------------
   */

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setUser(null);
          return;
        }

        const response = await axiosClient.get("/auth/me");

        setUser(response.data.user);

        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      } catch (error) {
        console.error(
          "Session restoration failed:",
          error
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
      } finally {
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

    const token = response.token;

    localStorage.setItem("token", token);
    localStorage.setItem(
      "user",
      JSON.stringify(response.user)
    );

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
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  const isAuthenticated = Boolean(user);

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