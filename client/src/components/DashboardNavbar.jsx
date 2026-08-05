import React from 'react'

// src/components/PublicNavbar.jsx

// src/components/DashboardNavbar.jsx

function DashboardNavbar() {
  return (
    <header
      style={{
        height: "70px",
        background: "#1e293b",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      <h2>JobPulse Dashboard</h2>

      <div>User Profile</div>
    </header>
  );
}

export default DashboardNavbar;