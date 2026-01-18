import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

const NeuButton = ({ children, onClick, variant = "default", className, type = "button", ...props }) => {
  const baseStyles =
    "px-6 py-3 rounded-full font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95";

  const variants = {
    default:
      "bg-neo-bg-100 text-neo-bg-800 shadow-neo hover:shadow-neo-lg hover:-translate-y-0.5 active:shadow-neo-inset",
    primary:
      "bg-neo-primary-600 text-white shadow-neo hover:bg-neo-primary-700 hover:shadow-neo-lg hover:-translate-y-0.5 active:shadow-neo-inset",
    accent:
      "bg-neo-accent-500 text-white shadow-neo hover:bg-neo-accent-400 hover:shadow-neo-lg hover:-translate-y-0.5 active:shadow-neo-inset",
    ghost: "bg-transparent text-neo-bg-700 hover:bg-neo-bg-100/50 hover:text-neo-primary-600",
    icon: "p-3 rounded-full aspect-square flex items-center justify-center bg-neo-bg-100 shadow-neo hover:shadow-neo-lg active:shadow-neo-inset text-neo-primary-600",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={cn(baseStyles, variants[variant], className)}
      whileTap={{ scale: 0.95 }}
      {...props}>
      {children}
    </motion.button>
  );
};

export default NeuButton;
