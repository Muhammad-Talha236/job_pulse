// src/context/AuthContext.jsx

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

/*
 * ---------------------------------------------------------
 * Auth Context
 * ---------------------------------------------------------
 *
 * This context stores authentication-related state
 * that needs to be available throughout the application.
 */
const AuthContext = createContext(null);


/*
 * ---------------------------------------------------------
 * Auth Provider
 * ---------------------------------------------------------
 *
 * AuthProvider wraps the application and makes
 * authentication state available to all child components.
 */
export function AuthProvider({ children }) {
  /*
   * Read the existing token when the application starts.
   *
   * This allows the user to remain logged in after
   * refreshing the browser.
   */
  const [token, setToken] = useState(
    () => localStorage.getItem("token")
  );

  /*
   * Read the stored user information.
   */
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  });


  /*
   * -------------------------------------------------------
   * Login
   * -------------------------------------------------------
   *
   * This function updates both React state and
   * localStorage.
   */
  const login = (authData) => {
    const { token, user } = authData;

    localStorage.setItem("token", token);
    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    setToken(token);
    setUser(user);
  };


  /*
   * -------------------------------------------------------
   * Logout
   * -------------------------------------------------------
   */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };


  /*
   * -------------------------------------------------------
   * Authentication Status
   * -------------------------------------------------------
   */
  const isAuthenticated = Boolean(token);


  /*
   * -------------------------------------------------------
   * Context Value
   * -------------------------------------------------------
   *
   * useMemo prevents creating a new object on every
   * render unless one of these values changes.
   */
  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      login,
      logout,
    }),
    [token, user, isAuthenticated]
  );


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


/*
 * ---------------------------------------------------------
 * useAuth Hook
 * ---------------------------------------------------------
 *
 * Instead of importing useContext and AuthContext
 * everywhere, components can simply use:
 *
 * const { user, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}