import React from "react";
import NeuCard from "../components/atoms/NeuCard";
import NeuInput from "../components/atoms/NeuInput";
import NeuButton from "../components/atoms/NeuButton";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="max-w-md mx-auto py-10">
      <NeuCard className="text-center">
        <h1 className="text-3xl font-bold text-neo-primary-800 mb-2">Welcome Back</h1>
        <p className="text-neo-bg-600 mb-8">Sign in to continue sharing joy.</p>

        <form className="flex flex-col gap-6 text-left">
          <NeuInput label="Email" type="email" placeholder="john@example.com" />
          <div>
            <NeuInput label="Password" type="password" placeholder="••••••••" />
            <div className="flex justify-end mt-2">
              <Link
                to="/forgot-password"
                className="text-sm text-neo-bg-500 hover:text-neo-primary-600 transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          <NeuButton variant="primary" className="w-full justify-center text-lg mt-2">
            Sign In
          </NeuButton>
        </form>

        <div className="mt-8 text-neo-bg-600 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-neo-primary-700 font-semibold hover:underline">
            Create Account
          </Link>
        </div>
      </NeuCard>
    </div>
  );
};

export default Login;
