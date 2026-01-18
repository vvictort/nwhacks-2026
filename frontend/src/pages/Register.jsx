import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import NeuCard from "../components/atoms/NeuCard";
import NeuInput from "../components/atoms/NeuInput";
import NeuButton from "../components/atoms/NeuButton";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: "Weak", color: "text-red-500" };
    if (strength <= 3) return { strength, label: "Fair", color: "text-yellow-500" };
    if (strength <= 4) return { strength, label: "Good", color: "text-blue-500" };
    return { strength, label: "Strong", color: "text-green-500" };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!termsAccepted) {
      newErrors.terms = "Please accept the terms and privacy policy to continue";
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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
      terms: true,
    });

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success
      setSuccess(true);

      // Redirect after success
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);

      // Provide specific error feedback
      let errorMessage = 'Registration failed. Please try again.';
      if (error.message?.includes('fetch') || error.message?.includes('network')) {
        errorMessage = 'Unable to connect. Please check your internet connection.';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Try logging in instead.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({ submit: errorMessage });
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="max-w-lg mx-auto py-10 relative">
      {/* Floating toy decorations */}
      <motion.div
        className="absolute top-0 left-0 text-6xl opacity-20"
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
        🧸
      </motion.div>
      <motion.div
        className="absolute top-20 right-10 text-5xl opacity-20"
        animate={{ y: [0, 15, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
        🚂
      </motion.div>
      <motion.div
        className="absolute bottom-40 left-5 text-4xl opacity-20"
        animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
        🎨
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <NeuCard className="text-center relative overflow-visible">
          <div className="mb-8">
            {/* Toy icons cluster */}
            <div className="flex justify-center gap-3 mb-4">
              <motion.div
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neo-primary-800 to-neo-primary-700 flex items-center justify-center shadow-lg"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}>
                <span className="text-2xl">🎪</span>
              </motion.div>
              <motion.div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neo-primary-800 to-neo-primary-300 flex items-center justify-center shadow-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}>
                <span className="text-3xl">🎁</span>
              </motion.div>
              <motion.div
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neo-primary-400 to-neo-primary-300 flex items-center justify-center shadow-lg"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}>
                <span className="text-2xl">🎮</span>
              </motion.div>
            </div>
            <h1 className="text-4xl font-bold font-display bg-gradient-to-r from-neo-primary-800 via-neo-accent-400 to-neo-primary-300 bg-clip-text text-transparent mb-2">
              Join the Fun!
            </h1>
            <p className="text-neo-bg-600 text-lg">Let's share toys and spread smiles worldwide! 🌍✨</p>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mb-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl flex items-center gap-3 shadow-lg">
                <motion.span className="text-4xl" animate={{ rotate: [0, 360] }} transition={{ duration: 0.6 }}>
                  🎉
                </motion.span>
                <div>
                  <p className="text-green-800 font-bold text-base">Woohoo! Welcome to PlayItForward! 🎊</p>
                  <p className="text-green-600 text-sm">Get ready to spread joy...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="mb-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl flex items-center gap-3 shadow-lg">
                <motion.span
                  className="text-3xl"
                  animate={{ rotate: [-10, 10, -10] }}
                  transition={{ duration: 0.5, repeat: 2 }}>
                  😅
                </motion.span>
                <p className="text-red-800 text-sm font-medium">{errors.submit}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <NeuInput
                  label="First Name"
                  type="text"
                  name="firstName"
                  placeholder="John"
                  maxLength={50}
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={() => handleBlur("firstName")}
                />
                <AnimatePresence>
                  {touched.firstName && errors.firstName && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-xs mt-1 ml-4">
                      {errors.firstName}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <div>
                <NeuInput
                  label="Last Name"
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  maxLength={50}
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={() => handleBlur("lastName")}
                />
                <AnimatePresence>
                  {touched.lastName && errors.lastName && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-xs mt-1 ml-4">
                      {errors.lastName}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div>
              <NeuInput
                label="Email Address"
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
              {formData.password && (
                <div className="mt-2 ml-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1.5 bg-neo-bg-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                        className={`h-full ${passwordStrength.strength <= 2
                          ? "bg-red-500"
                          : passwordStrength.strength <= 3
                            ? "bg-yellow-500"
                            : passwordStrength.strength <= 4
                              ? "bg-blue-500"
                              : "bg-green-500"
                          }`}
                      />
                    </div>
                    <span className={`text-xs font-medium ${passwordStrength.color}`}>{passwordStrength.label}</span>
                  </div>
                  <p className="text-xs text-neo-bg-500">Use 8+ characters with mix of letters, numbers & symbols</p>
                </div>
              )}
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
            </div>

            <div>
              <NeuInput
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                maxLength={100}
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={() => handleBlur("confirmPassword")}
              />
              <AnimatePresence>
                {touched.confirmPassword && errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 text-xs mt-1 ml-4">
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <div className="flex items-start gap-3 mt-2">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked);
                      if (e.target.checked && errors.terms) {
                        setErrors({ ...errors, terms: "" });
                      }
                    }}
                    className={`mt-1 w-6 h-6 rounded-xl shadow-neo-inset bg-neo-bg-100 border-0 text-neo-primary-500 focus:ring-2 focus:ring-neo-primary-300/50 cursor-pointer transition-all ${touched.terms && errors.terms ? "ring-2 ring-red-400" : ""
                      }`}
                  />
                </div>
                <label htmlFor="terms" className="text-sm text-neo-bg-600 text-left flex-1">
                  I agree to the{" "}
                  <Link to="/terms" className="text-neo-primary-700 font-semibold hover:underline">
                    Terms of Use
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-neo-primary-700 font-semibold hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              <AnimatePresence>
                {touched.terms && errors.terms && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-3 ml-2 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl flex items-center gap-2 shadow-md">
                    <span className="text-2xl">📋</span>
                    <p className="text-orange-700 text-xs font-medium">{errors.terms}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div whileHover={{ scale: isLoading ? 1 : 1.02 }} whileTap={{ scale: isLoading ? 1 : 0.98 }}>
              <NeuButton
                type="submit"
                variant="primary"
                className="w-full justify-center text-lg mt-2 relative"
                disabled={isLoading || success}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block">
                      ⏳
                    </motion.span>
                    Creating Account...
                  </span>
                ) : success ? (
                  <span className="flex items-center gap-2">
                    <span>✓</span>
                    Account Created!
                  </span>
                ) : (
                  "Create Account"
                )}
              </NeuButton>
            </motion.div>
          </form>

          <div className="mt-8 pt-6 border-t border-neo-bg-200">
            <p className="text-neo-bg-600 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-neo-primary-700 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </NeuCard>
      </motion.div>

      {/* Additional Info */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}>
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          <motion.div className="flex flex-col items-center gap-2" whileHover={{ scale: 1.1, rotate: 5 }}>
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-green-100 to-emerald-200 shadow-lg flex items-center justify-center text-3xl">
              🛡️
            </div>
            <p className="text-xs text-neo-bg-700 font-bold">Safe & Secure</p>
          </motion.div>
          <motion.div className="flex flex-col items-center gap-2" whileHover={{ scale: 1.1, rotate: -5 }}>
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-blue-100 to-cyan-200 shadow-lg flex items-center justify-center text-3xl">
              ⚡
            </div>
            <p className="text-xs text-neo-bg-700 font-bold">Super Quick</p>
          </motion.div>
          <motion.div className="flex flex-col items-center gap-2" whileHover={{ scale: 1.1, rotate: 5 }}>
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-200 shadow-lg flex items-center justify-center text-3xl">
              🎈
            </div>
            <p className="text-xs text-neo-bg-700 font-bold">Always Free</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
