import React, { useState, useRef, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const NeuSelect = ({ value, onChange, options, label, icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {label && (
                <label className="block text-sm font-bold text-neo-bg-700 mb-3 items-center gap-2">
                    {icon} {label}
                </label>
            )}

            {/* Select Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-5 py-3 rounded-2xl bg-neo-bg-100 shadow-neo-inset text-neo-bg-800 font-semibold focus:outline-none focus:shadow-[inset_8px_8px_16px_#ddd9c8,inset_-8px_-8px_16px_#ffffff] transition-all cursor-pointer hover:bg-neo-bg-50 flex items-center justify-between">
                <span className="flex items-center gap-2">
                    <span>{selectedOption.emoji}</span>
                    <span>{selectedOption.label}</span>
                </span>
                <motion.svg
                    className="w-5 h-5 text-neo-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 w-full mt-2 rounded-2xl bg-neo-bg-100 shadow-neo border border-neo-bg-200 overflow-hidden">
                        <div className="max-h-60 overflow-y-auto">
                            {options.map((option, index) => (
                                <motion.button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option.value)}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className={`w-full px-5 py-3 text-left flex items-center gap-2 font-semibold transition-all ${option.value === value
                                        ? "bg-gradient-to-r from-neo-primary-500 to-neo-primary-600 text-white"
                                        : "text-neo-bg-800 hover:bg-neo-bg-50"
                                        }`}>
                                    <span>{option.emoji}</span>
                                    <span>{option.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NeuSelect;
