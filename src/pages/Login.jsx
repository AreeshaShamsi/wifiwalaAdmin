import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  AlertCircle
} from "lucide-react";


export default function AdminLogin() {
  const navigate = useNavigate();

  // 🔒 If already logged in, skip login page
  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME;
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

  const handleSubmit = () => {
    setError("");
    setIsLoading(true);

    const togglePassword = () => {
  setShowPassword(prev => !prev);
};


    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // ✅ SAVE SESSION TOKEN
        sessionStorage.setItem("adminToken", "true");

        setIsLoading(false);
        navigate("/dashboard", { replace: true });
      } else {
        setIsLoading(false);
        setError("Invalid username or password");
      }
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  
  

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-600">Sign in to access dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 space-y-4">

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Username */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyPress}
                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter username"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyPress}
                className="w-full pl-12 pr-14 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Remember */}
          <div className="flex items-center">
            
          </div>

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || !username || !password}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          © 2026 Admin Panel
        </p>
      </div>
    </div>
  );
}
