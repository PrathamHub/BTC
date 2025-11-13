import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, LogOut, LogIn } from "lucide-react";
import { toast } from "react-toastify";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // ✅ Listen for login/logout changes
  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("authChange", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("authChange", checkLoginStatus);
    };
  }, []);

  const triggerAuthChange = () => {
    window.dispatchEvent(new Event("authChange"));
  };

  // ✅ Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    triggerAuthChange(); // Let Navbar re-render
    toast.success("✅ Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="backdrop-blur-lg bg-gradient-to-r from-gray-900/90 via-gray-800/80 to-gray-900/90 text-white px-6 py-3 shadow-lg sticky top-0 z-50 border-b border-gray-700/40">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-orange-400 hover:to-yellow-400 transition-all duration-500">
          <Link to="/fena">Fena App</Link>
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 items-center text-lg font-medium">
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

          <li>
            <Link
              to="/fena/bills"
              className="relative hover:text-yellow-400 transition duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-yellow-400 hover:after:w-full after:transition-all after:duration-300"
            >
              All Bills
            </Link>
          </li>

          {/* ✅ Conditional Login/Logout */}
          <li>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition text-white"
              >
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition text-white"
              >
                <LogIn size={18} /> Login
              </button>
            )}
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-3 bg-gray-900/95 rounded-xl shadow-xl border border-gray-700 py-4 space-y-2 text-center animate-slide-down">
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

          {isLoggedIn ? (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
              className="flex justify-center items-center gap-2 w-full py-2 text-red-500 font-semibold hover:bg-gray-700 rounded-md"
            >
              <LogOut size={18} /> Logout
            </button>
          ) : (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/login");
              }}
              className="flex justify-center items-center gap-2 w-full py-2 text-green-500 font-semibold hover:bg-gray-700 rounded-md"
            >
              <LogIn size={18} /> Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
