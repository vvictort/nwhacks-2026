import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../../utils/cn";

const Navbar = () => {
  const location = useLocation();

  // Simulate logged-in state based on route (in real app, use auth context)
  const isLoggedIn = location.pathname.startsWith("/dashboard");

  const publicNavItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/vision", label: "Vision", icon: "👁️" },
    { path: "/contact", label: "Contact", icon: "✉️" },
  ];

  const authNavItems = [{ path: "/login", label: "Login", icon: "🔐" }];

  const userNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/dashboard#account", label: "Account", icon: "👤" },
  ];

  const navItems = [...publicNavItems, ...(isLoggedIn ? userNavItems : authNavItems)];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-6 px-4 flex justify-center">
      <div className="bg-neo-bg-100/95 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] px-2 py-2 border border-neo-bg-200/50 max-w-2xl">
        <ul className="flex items-center justify-center gap-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all duration-300 relative overflow-hidden group",
                    isActive
                      ? "bg-neo-primary-500 text-white shadow-lg"
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
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
