import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../utils/cn";

const Navbar = () => {
  // const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const publicNavItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/browse", label: "Browse", icon: "🧸" },
    { path: "/vision", label: "Vision", icon: "👁️" },
    { path: "/contact", label: "Contact", icon: "✉️" },
  ];

  const authNavItems = [{ path: "/login", label: "Login", icon: "🔐" }];

  const userNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: "🏠" },
    { path: "/browse", label: "Browse", icon: "🧸" },
    { path: "/donate", label: "Donate", icon: "🎁" },
    { path: "/contact", label: "Contact", icon: "✉️" },
  ];

  const navItems = user ? userNavItems : [...publicNavItems, ...authNavItems];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-6 px-4 flex justify-center">
      <div className="bg-neo-bg-100/95 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] px-2 py-2 border border-neo-bg-200/50 w-auto max-w-[95vw]">
        <ul className="flex items-center justify-center gap-1 flex-wrap">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold transition-all duration-300 relative overflow-hidden group",
                    isActive
                      ? "bg-neo-primary-600 text-white shadow-lg"
                      : "text-neo-bg-700 hover:text-neo-primary-600 hover:bg-neo-bg-200",
                  )
                }>
                <span className="text-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  {item.icon}
                </span>
                <span className="text-sm whitespace-nowrap">{item.label}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-neo-primary-400/0 via-neo-primary-400/10 to-neo-primary-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </NavLink>
            </li>
          ))}
          {user && (
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold transition-all duration-300 relative overflow-hidden group text-red-600 hover:bg-red-50 hover:text-red-700 border-l border-neo-bg-200 ml-1">
                <span className="text-lg transition-transform duration-300 group-hover:scale-110">
                  🚪
                </span>
                <span className="text-sm whitespace-nowrap">Logout</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/10 to-red-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
