// src/components/PublicNavbar.jsx
import React from 'react'
function PublicNavbar() {
  return (
    <header
      style={{
        height: "70px",
        background: "#2563eb",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
      }}
    >
      <h2>JobPulse</h2>

      <nav
        style={{
          display: "flex",
          gap: "24px",
        }}
      >
        <p>Home</p>

        <p>Login</p>
      </nav>
    </header>
  );
}

export default PublicNavbar;