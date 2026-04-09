import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext"; // adjust path

const Home = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  // ✅ Logout Handler
  const handleLogout = () => {
    logout(); // 👈 using global logout
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 text-center">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">
        Welcome to Fena Billing System 💼
      </h1>
      <p className="text-gray-600 mb-6">
        Manage your bills, track stock, and simplify your business.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Billing Button */}
        <Link
          to="/fena"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Go to Billing
        </Link>

        {/* Stocks Button */}
        <Link
          to="/fena/stocks"
          className="bg-green-600 text-white px-5 py-2 roun ded-lg hover:bg-green-700 transition"
        >
          View Stocks
        </Link>

        {/* NEW: Customer History Button */}
        <Link
          to="/fena/customer-history"
          className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Customer History
        </Link>

        {/* 🔥 Show Login if user is NOT logged in */}
        {/* {!token && (
          <Link
            to="/login"
            className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </Link>
        )} */}

        {/* 🔥 Show Logout if user IS logged in */}
        {/* {token && (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        )} */}
      </div>
    </div>
  );
};

export default Home;
