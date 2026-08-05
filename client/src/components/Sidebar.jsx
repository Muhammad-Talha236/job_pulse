import React from 'react'

// src/components/Sidebar.jsx

function Sidebar() {
  return (
    <aside
      style={{
        width: "240px",
        background: "#f4f4f4",
        padding: "20px",
        minHeight: "calc(100vh - 70px)",
        borderRight: "1px solid #ddd",
      }}
    >
      <h3>Sidebar</h3>

      <p>Dashboard</p>

      <p>Jobs</p>

      <p>Saved Jobs</p>
    </aside>
  );
}

export default Sidebar;