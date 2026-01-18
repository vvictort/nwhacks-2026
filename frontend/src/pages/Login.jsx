import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import NeuCard from "../components/atoms/NeuCard";
import NeuInput from "../components/atoms/NeuInput";
import NeuButton from "../components/atoms/NeuButton";
import { signInWithGoogle } from "../utils/authService";

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

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      setErrors({ submit: "Google sign-in failed. Please try again." });
      console.error(error);
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
            className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-neo-primary-800 to-neo-primary-300 flex items-center justify-center shadow-2xl"
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
            <span className="text-4xl">🎁</span>
          </motion.div>
          <h1 className="text-4xl font-bold font-display bg-gradient-to-r from-neo-primary-900 via-neo-accent-400 to-neo-primary-300 bg-clip-text text-transparent mb-2">
            Welcome Back!
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

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neo-bg-300 to-transparent"></div>
            <span className="text-neo-bg-500 text-sm font-medium">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neo-bg-300 to-transparent"></div>
          </div>

          {/* Google Sign In Button */}
          <motion.div whileHover={{ scale: isLoading ? 1 : 1.02 }} whileTap={{ scale: isLoading ? 1 : 0.98 }}>
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-neo-bg-300 rounded-2xl shadow-neu hover:shadow-neu-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-semibold text-neo-bg-700">Continue with Google</span>
            </button>
          </motion.div>

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
