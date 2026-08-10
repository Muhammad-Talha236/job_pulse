// src/components/auth/ProtectedRoute.jsx

import { Navigate, Outlet, useLocation } from "react-router-dom";

/*
 * ProtectedRoute
 *
 * This component checks whether the user has
 * an authentication token.
 *
 * If a token exists:
 *     Allow the user to continue.
 *
 * If a token does not exist:
 *     Redirect the user to /login.
 */
function ProtectedRoute() {
  const location = useLocation();

  const token = localStorage.getItem("token");

  /*
   * No token means the user is not authenticated.
   */
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  /*
   * Token exists.
   *
   * Outlet renders whichever protected
   * child route the user requested.
   */
  return <Outlet />;    
}

export default ProtectedRoute;