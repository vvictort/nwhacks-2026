import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/vision", label: "Vision" },
    { path: "/contact", label: "Contact" },
    { path: "/login", label: "Login" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-6 px-4 flex justify-center">
      <motion.div
        className="bg-neo-bg-100/90 backdrop-blur-md rounded-full shadow-neo px-6 py-3 md:px-8 md:py-4 flex items-center justify-center"
        initial={false}
        animate={{
          // Only animate width horizontally - no vertical changes
          width: isScrolled ? "auto" : "100%",
          maxWidth: isScrolled ? "fit-content" : "56rem",
        }}
        transition={{
          type: "tween",
          duration: 0.5, // Slower, more gradual
          ease: [0.4, 0, 0.2, 1], // Smooth cubic-bezier
        }}>
        <ul className="flex items-center justify-center gap-2 md:gap-4">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path}>
                {({ isActive }) => (
                  <motion.div
                    className={cn(
                      "px-4 py-2 md:px-6 md:py-2 rounded-full font-medium transition-all duration-200 text-sm md:text-base whitespace-nowrap",
                      isActive
                        ? "bg-neo-primary-500 text-white shadow-lg scale-105"
                        : "bg-transparent text-neo-bg-700 hover:text-neo-primary-700 hover:bg-neo-bg-200/50",
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}>
                    {item.label}
                  </motion.div>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </motion.div>
    </nav>
  );
};

export default Navbar;
