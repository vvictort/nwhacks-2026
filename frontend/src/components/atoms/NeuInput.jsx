import React from "react";
import { cn } from "../../utils/cn";

// Sanitize input to prevent XSS - strips HTML tags and dangerous characters
const sanitizeInput = (value) => {
  if (typeof value !== 'string') return value;
  return value
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>"'`]/g, ''); // Remove potentially dangerous characters
};

const NeuInput = ({
  label,
  type = "text",
  placeholder,
  className,
  maxLength = 255, // Default max length
  onChange,
  sanitize = true, // Enable sanitization by default
  ...props
}) => {
  const handleChange = (e) => {
    if (sanitize && type !== 'password' && type !== 'email') {
      e.target.value = sanitizeInput(e.target.value);
    }
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <label className="ml-4 text-sm font-semibold text-neo-bg-600">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={handleChange}
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
