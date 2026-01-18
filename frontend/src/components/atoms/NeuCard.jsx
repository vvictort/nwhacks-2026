import React from "react";
import { cn } from "../../utils/cn";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const NeuCard = ({ children, className, title, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn("bg-neo-bg-100 rounded-3xl shadow-neo p-8", className)}
      {...props}>
      {title && <h3 className="text-xl font-bold text-neo-primary-800 mb-4">{title}</h3>}
      {children}
    </motion.div>
  );
};

export default NeuCard;
