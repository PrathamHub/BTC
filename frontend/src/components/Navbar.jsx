import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        <Link to="/">Fena App</Link>
      </h1>

      <ul className="flex space-x-8 items-center">
        {/* Stocks Dropdown */}
        <li className="relative">
          <button
            onClick={toggleDropdown}
            className="hover:text-yellow-400 focus:outline-none"
          >
            Stocks ▾
          </button>

          {isDropdownOpen && (
            <ul className="absolute bg-white text-black mt-2 py-2 w-44 rounded-lg shadow-lg right-0 z-10">
              <li>
                <Link
                  to="/stocks"
                  className="block px-4 py-2 hover:bg-gray-200"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Get All Stock
                </Link>
              </li>
              <li>
                <Link
                  to="/stocks/update"
                  className="block px-4 py-2 hover:bg-gray-200"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Update Stock
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Bills Link */}
        <li>
          <Link to="/bills" className="hover:text-yellow-400">
            All Bills
          </Link>
        </li>
      </ul>
    </nav>
  );
}
