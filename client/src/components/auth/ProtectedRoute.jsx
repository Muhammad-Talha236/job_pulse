// src/components/auth/ProtectedRoute.jsx

import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

/*
 * ProtectedRoute
 *
 * Uses AuthContext as the single source of truth
 * for authentication status.
 */
function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  /*
   * Still checking session on first load.
   */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-500">
          Loading...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;