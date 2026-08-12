import { Route, Routes } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import PublicLayout from "../layouts/PublicLayout";

import ProtectedRoute from "../components/auth/ProtectedRoute";

import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import HomePage from "../pages/HomePage";
import JobsPage from "../pages/JobsPage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import SavedJobsPage from "../pages/SavedJobsPage";

import ProfilePage from "../pages/ProfilePage";

function AppRoutes() {
  return (
    <Routes>
      {/* =====================================================
          Public Routes
          ===================================================== */}

      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* =====================================================
          Protected Dashboard Routes
          ===================================================== */}

      <Route element={<ProtectedRoute />}>
    
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/jobs" element={<JobsPage />} />

          <Route path="/saved-jobs" element={<SavedJobsPage />} />

          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* =====================================================
          404
          ===================================================== */}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
