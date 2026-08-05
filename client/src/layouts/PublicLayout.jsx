// src/layouts/PublicLayout.jsx

import { Outlet } from "react-router-dom";

import PublicNavbar from "../components/PublicNavbar";
import Footer from "../components/Footer";

function PublicLayout() {
  return (
    <>
      <PublicNavbar />

      <main
        style={{
          minHeight: "calc(100vh - 130px)",
          padding: "40px",
        }}
      >
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default PublicLayout;