import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import NeuCard from "../components/atoms/NeuCard";
import NeuInput from "../components/atoms/NeuInput";
import NeuButton from "../components/atoms/NeuButton";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({});

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

    if (!formData.password) {
      newErrors.password = "Password is required";
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

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate login (replace with actual API call)
      // For demo: check if credentials match a test account
      if (formData.email === "demo@example.com" && formData.password === "password") {
        navigate("/");
      } else {
        setErrors({ submit: "Invalid email or password. Try demo@example.com / password" });
      }
    } catch (error) {
      setErrors({ submit: "An error occurred. Please try again." });
      console.log(error);
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
        🎪
      </motion.div>
      <motion.div
        className="absolute bottom-20 -left-10 text-5xl opacity-20"
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
        🎠
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <NeuCard className="text-center relative overflow-visible">
          <motion.div
            className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 flex items-center justify-center shadow-2xl"
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
            <span className="text-4xl">🎁</span>
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-2">
            Welcome Back! 👋
          </h1>
          <p className="text-neo-bg-600 mb-8 text-lg">Ready to spread more joy? Let's go! 🚀</p>

          {/* Error Message */}
          <AnimatePresence>
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl flex items-center gap-3 shadow-lg">
                <motion.span
                  className="text-3xl"
                  animate={{ rotate: [-10, 10, -10] }}
                  transition={{ duration: 0.5, repeat: 2 }}>
                  🤔
                </motion.span>
                <p className="text-red-800 text-sm text-left font-medium">{errors.submit}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 text-left">
            <div>
              <NeuInput
                label="Email"
                type="email"
                name="email"
                placeholder="john@example.com"
                maxLength={255}
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur("email")}
              />
              <AnimatePresence>
                {touched.email && errors.email && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 text-xs mt-1 ml-4">
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div>
              <NeuInput
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                maxLength={100}
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur("password")}
              />
              <AnimatePresence>
                {touched.password && errors.password && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 text-xs mt-1 ml-4">
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
              <div className="flex justify-end mt-2">
                <Link
                  to="/forgot-password"
                  className="text-sm text-neo-bg-500 hover:text-neo-primary-600 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <motion.div whileHover={{ scale: isLoading ? 1 : 1.02 }} whileTap={{ scale: isLoading ? 1 : 0.98 }}>
              <NeuButton
                type="submit"
                variant="primary"
                className="w-full justify-center text-lg mt-2"
                disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block">
                      ⏳
                    </motion.span>
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </NeuButton>
            </motion.div>
          </form>

          <div className="mt-8 text-neo-bg-600 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-neo-primary-700 font-semibold hover:underline">
              Create Account
            </Link>
          </div>
        </NeuCard>
      </motion.div>

      {/* Demo hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 text-center">
        <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 rounded-full shadow-lg">
          <p className="text-sm text-purple-800 font-medium">
            💡 <span className="font-bold">Try it:</span> demo@example.com / password
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
