// src/components/DashboardNavbar.jsx

import { LogOut, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function DashboardNavbar() {
  const navigate = useNavigate();

  /*
   * Get authentication information from AuthContext.
   *
   * user:
   * Contains the currently logged-in user's information.
   *
   * isAuthenticated:
   * Tells us whether the user is currently logged in.
   *
   * logout:
   * Clears the authentication state.
   */
  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();


  /*
   * ---------------------------------------------------------
   * Handle Logout
   * ---------------------------------------------------------
   */
  const handleLogout = () => {
    logout();

    /*
     * After logging out, send the user to Login.
     */
    navigate("/login");
  };


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

      {/* ---------------------------------------------------
          Brand
      ---------------------------------------------------- */}

      <div>
        <strong>JobPulse Dashboard</strong>
      </div>


      {/* ---------------------------------------------------
          User Section
      ---------------------------------------------------- */}

      {isAuthenticated && user && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >

          {/* User Information */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >

            <UserCircle size={28} />

            <div>
              <div
                style={{
                  fontWeight: "600",
                }}
              >
                {user.name}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#cbd5e1",
                }}
              >
                {user.email}
              </div>
            </div>

          </div>


          {/* Logout Button */}

          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "transparent",
              border: "1px solid #475569",
              borderRadius: "6px",
              color: "white",
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >

            <LogOut size={16} />

            Logout

          </button>

        </div>
      )}

    </header>
  );
}

export default DashboardNavbar;