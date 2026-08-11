import { useEffect, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  Bookmark,
  User,
  LayoutDashboard,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

function DashboardNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  /*
   * Try to read user information from localStorage.
   * If your backend stores the user differently, we can connect
   * this later with the actual auth/user context.
   */
  const getUser = () => {
    try {
      const storedUser =
        localStorage.getItem("user");

      return storedUser
        ? JSON.parse(storedUser)
        : null;
    } catch {
      return null;
    }
  };

  const user = getUser();

  const userName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    "User";

  const userEmail =
    user?.email || "Job Seeker";

  const avatarLetter =
    userName.charAt(0).toUpperCase();

  /*
   * Close menus when route changes.
   */
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  /*
   * Close profile dropdown when clicking outside.
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /*
   * Logout
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setProfileOpen(false);
    setMobileOpen(false);

    navigate("/login");
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Find Jobs",
      path: "/jobs",
      icon: BriefcaseBusiness,
    },
    {
      label: "Saved Jobs",
      path: "/saved-jobs",
      icon: Bookmark,
    },
  ];

  /*
   * Desktop navigation styles.
   */
  const navLinkClass = ({ isActive }) =>
    [
      "group relative inline-flex items-center gap-2",
      "rounded-xl px-3.5 py-2.5",
      "text-sm font-semibold",
      "transition-all duration-200",
      isActive
        ? "bg-slate-950 text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
    ].join(" ");

  /*
   * Mobile navigation styles.
   */
  const mobileNavLinkClass = ({ isActive }) =>
    [
      "flex items-center gap-3",
      "rounded-xl px-4 py-3",
      "text-sm font-semibold",
      "transition-all duration-200",
      isActive
        ? "bg-slate-950 text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
    ].join(" ");

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-2xl">
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* =================================================
            LOGO
        ================================================== */}

        <Link
          to="/dashboard"
          className="group flex items-center gap-3"
        >
          {/* Logo Icon */}
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/10 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl">
            <BriefcaseBusiness size={20} />

            <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600">
              <Sparkles
                size={9}
                strokeWidth={2.5}
              />
            </div>
          </div>

          {/* Brand */}
          <div className="hidden sm:block">
            <div className="flex items-center">
              <span className="text-lg font-black tracking-tight text-slate-950">
                Job
              </span>

              <span className="text-lg font-black tracking-tight text-blue-600">
                Pulse
              </span>
            </div>

            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Find. Match. Grow.
            </p>
          </div>
        </Link>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================== */}

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={navLinkClass}
              >
                <Icon
                  size={16}
                  strokeWidth={2}
                />

                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* =================================================
            RIGHT SIDE
        ================================================== */}

        <div className="flex items-center gap-2">
          {/* Profile */}
          <div
            ref={profileRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setProfileOpen(
                  (value) => !value
                )
              }
              className="group flex items-center gap-2 rounded-xl p-1.5 pr-2 transition-all hover:bg-slate-100"
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
            >
              {/* Avatar */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-sm">
                {avatarLetter}
              </div>

              {/* User Information */}
              <div className="hidden max-w-[120px] text-left lg:block">
                <p className="truncate text-xs font-bold text-slate-800">
                  {userName}
                </p>

                <p className="truncate text-[11px] text-slate-400">
                  {userEmail}
                </p>
              </div>

              <ChevronDown
                size={15}
                className={`hidden text-slate-400 transition-transform duration-200 lg:block ${
                  profileOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {/* =================================================
                PROFILE DROPDOWN
            ================================================== */}

            {profileOpen && (
              <div className="absolute right-0 top-[52px] w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10">
                {/* User Header */}
                <div className="mb-1 rounded-xl bg-slate-50 px-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
                      {avatarLetter}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {userName}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {userEmail}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profile */}
                <Link
                  to="/profile"
                  onClick={() =>
                    setProfileOpen(false)
                  }
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                >
                  <User size={17} />

                  Profile
                </Link>

                <div className="my-1 border-t border-slate-100" />

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={17} />

                  Logout
                </button>
              </div>
            )}
          </div>

          {/* =================================================
              MOBILE MENU BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={() =>
              setMobileOpen(
                (value) => !value
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>
      </div>

      {/* =====================================================
          MOBILE NAVIGATION
      ====================================================== */}

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 pb-4 pt-3 shadow-sm md:hidden">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={
                    mobileNavLinkClass
                  }
                >
                  <Icon size={18} />

                  {item.label}
                </NavLink>
              );
            })}

            {/* Profile */}
            <NavLink
              to="/profile"
              className={
                mobileNavLinkClass
              }
            >
              <User size={18} />

              Profile
            </NavLink>

            <div className="my-2 border-t border-slate-100" />

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={18} />

              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

export default DashboardNavbar;