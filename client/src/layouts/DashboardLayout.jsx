// src/layouts/DashboardLayout.jsx

import { Outlet } from "react-router-dom";

import DashboardNavbar from "../components/DashboardNavbar";
import Sidebar from "../components/Sidebar";

function DashboardLayout() {
  return (
    <>
      {/* Dashboard Navbar */}
      <DashboardNavbar />

      <div
        style={{
          display: "flex",
        }}
      >
        {/* Dashboard Sidebar */}
        <Sidebar />

        {/* Dashboard Content */}
        <main
          style={{
            flex: 1,
            padding: "24px",
          }}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default DashboardLayout;