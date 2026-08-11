import { Outlet } from "react-router-dom";

import DashboardNavbar from "../components/DashboardNavbar";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <DashboardNavbar />

      {/* Page Content */}
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;