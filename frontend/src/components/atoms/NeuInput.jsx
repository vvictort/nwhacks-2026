import React from "react";
import { cn } from "../../utils/cn";

const NeuInput = ({ label, type = "text", placeholder, className, ...props }) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <label className="ml-4 text-sm font-semibold text-neo-bg-600">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        className="
          w-full bg-neo-bg-100 rounded-xl shadow-neo-inset px-6 py-4 
          text-neo-bg-800 placeholder:text-neo-bg-400
          focus:outline-none focus:ring-2 focus:ring-neo-primary-300/50
          transition-all duration-200
        "
        {...props}
      />
    </div>
  );
};

export default NeuInput;
