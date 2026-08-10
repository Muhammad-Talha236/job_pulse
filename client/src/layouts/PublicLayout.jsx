// src/layouts/PublicLayout.jsx

import { Outlet } from "react-router-dom";

import Footer from "../components/Footer";
import PublicNavbar from "../components/PublicNavbar";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default PublicLayout;