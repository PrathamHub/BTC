import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="backdrop-blur-lg bg-gradient-to-r from-gray-900/90 via-gray-800/80 to-gray-900/90 text-white px-6 py-3 shadow-lg sticky top-0 z-50 border-b border-gray-700/40">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-orange-400 hover:to-yellow-400 transition-all duration-500">
          <Link to="/fena">Fena App</Link>
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 items-center text-lg font-medium">
          {/* Stocks Dropdown */}
          <li className="relative group">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-1 hover:text-yellow-400 focus:outline-none transition duration-300"
            >
              Stocks <ChevronDown size={18} className="mt-[2px]" />
            </button>

            {isDropdownOpen && (
              <ul className="absolute right-0 mt-3 bg-white text-gray-800 rounded-xl shadow-lg w-48 overflow-hidden animate-fade-in border border-gray-200 z-20">
                <li>
                  <Link
                    to="/fena/stocks"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-5 py-2.5 hover:bg-gray-100 hover:text-black transition duration-150"
                  >
                    Get All Stock
                  </Link>
                </li>
                <li>
                  <Link
                    to="/fena/stocks/update"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-5 py-2.5 hover:bg-gray-100 hover:text-black transition duration-150"
                  >
                    Update Stock
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Bills Link */}
          <li>
            <Link
              to="/fena/bills"
              className="relative hover:text-yellow-400 transition duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-yellow-400 hover:after:w-full after:transition-all after:duration-300"
            >
              All Bills
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none text-yellow-400"
        >
          {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-3 bg-gray-900/95 rounded-xl shadow-xl border border-gray-700 py-4 space-y-2 text-center animate-slide-down">
          {/* Stocks dropdown */}
          <div>
            <button
              onClick={toggleDropdown}
              className="flex justify-center items-center gap-1 w-full py-2 text-yellow-300 font-semibold"
            >
              Stocks <ChevronDown size={16} />
            </button>

            {isDropdownOpen && (
              <div className="mt-2 space-y-1">
                <Link
                  to="/fena/stocks"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsDropdownOpen(false);
                  }}
                  className="block py-2 hover:bg-gray-700 rounded-md"
                >
                  Get All Stock
                </Link>
                <Link
                  to="/fena/stocks/update"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsDropdownOpen(false);
                  }}
                  className="block py-2 hover:bg-gray-700 rounded-md"
                >
                  Update Stock
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/fena/bills"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 hover:bg-gray-700 rounded-md text-yellow-300 font-semibold"
          >
            All Bills
          </Link>
        </div>
      )}
    </nav>
  );
}
