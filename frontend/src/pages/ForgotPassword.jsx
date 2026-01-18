import React, { useState } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import NeuCard from "../components/atoms/NeuCard";
import NeuInput from "../components/atoms/NeuInput";
import NeuButton from "../components/atoms/NeuButton";
import confetti from "canvas-confetti";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    confirmEmail: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.confirmEmail.trim()) {
      newErrors.confirmEmail = "Please confirm your email";
    } else if (formData.email !== formData.confirmEmail) {
      newErrors.confirmEmail = "Emails do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#8c97c9", "#bb88a7", "#f5f2e8"],
      });
    } catch (_error) {
      setErrors({ submit: "An error occurred. Please try again." });
      console.error(_error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 relative">
      {/* Floating decorations */}
      <motion.div
        className="absolute -top-5 -right-5 text-6xl opacity-20"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
        🔑
      </motion.div>
      <motion.div
        className="absolute bottom-20 -left-10 text-5xl opacity-20"
        animate={{ y: [0, -20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
        📮
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <NeuCard className="text-center relative">
          <motion.div
            className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-2xl"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
            <span className="text-4xl text-white">🔒</span>
          </motion.div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent mb-2">
            Lost your key?
          </h1>
          <p className="text-neo-bg-600 mb-8">
            No worries! Enter your email twice to confirm, and we'll send you recovery instructions.
          </p>

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-6 text-left">
                <div>
                  <NeuInput
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    maxLength={255}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-red-500 text-xs mt-1 ml-4 italic">
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                <div>
                  <NeuInput
                    label="Confirm Email Address"
                    type="email"
                    name="confirmEmail"
                    placeholder="your@email.com"
                    maxLength={255}
                    value={formData.confirmEmail}
                    onChange={handleChange}
                  />
                  {errors.confirmEmail && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-red-500 text-xs mt-1 ml-4 italic">
                      {errors.confirmEmail}
                    </motion.p>
                  )}
                </div>

                <NeuButton
                  type="submit"
                  variant="primary"
                  className="w-full justify-center text-lg mt-4"
                  disabled={isLoading}>
                  {isLoading ? "Sending Link..." : "Send Recovery Link"}
                </NeuButton>

                <div className="text-center mt-4">
                  <Link
                    to="/login"
                    className="text-neo-bg-500 hover:text-neo-primary-600 font-semibold transition-colors">
                    Back to Login
                  </Link>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  📧
                </div>
                <h2 className="text-2xl font-bold text-green-700 mb-2">Check your inbox!</h2>
                <p className="text-neo-bg-600 mb-8">
                  We've sent recovery instructions to{" "}
                  <span className="font-bold text-neo-bg-800">{formData.email}</span>.
                </p>
                <Link to="/login">
                  <NeuButton variant="primary" className="w-full justify-center">
                    Return to Login
                  </NeuButton>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </NeuCard>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
