import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 text-center">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">
        Welcome to Fena Billing System 💼
      </h1>
      <p className="text-gray-600 mb-6">
        Manage your bills, track stock, and simplify your business.
      </p>

      <div className="flex gap-4">
        <Link
          to="/fena"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Go to Billing
        </Link>
        <Link
          to="/stocks"
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          View Stocks
        </Link>
      </div>
    </div>
  );
};

export default Home;
