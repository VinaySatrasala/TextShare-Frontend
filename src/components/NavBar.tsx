import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { FaMoon, FaSun, FaUserAlt } from "react-icons/fa";

const Navbar: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSessionChecked, setIsSessionChecked] = useState(false); // New state to track session check completion

  const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAuth();
  const location = useLocation();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Check user session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get(`${backendUrl}/auth`, { withCredentials: true });
        if (res.status === 200) {
          setIsLoggedIn(true);
          setUserName(res.data.name);
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      } finally {
        setIsSessionChecked(true); // Mark session check as complete
      }
    };
    checkSession();
  }, [setIsLoggedIn, setUserName, backendUrl]);

  // Handle theme toggle
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Logout function with confirmation
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        await axios.post(`${backendUrl}/logout`, {}, { withCredentials: true });
        setIsLoggedIn(false);
        setUserName(null);
        setIsDropdownOpen(false);
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }
  };
  

  // Check if the current route is an auth page
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  if (!isSessionChecked) {
    // Don't render anything until the session is checked
    return null;
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 px-8 py-4 text-white flex justify-between items-center shadow-lg ${
        isDarkMode
          ? "bg-gradient-to-r from-gray-900 to-black"
          : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
      }`}
    >
      {/* Left: Logo */}
      <div className="text-3xl font-bold text-white">
        <a href="/">TextShare</a>
      </div>

      {/* Middle: Navigation Links */}
      {!isAuthPage && (
        <div className="hidden md:flex space-x-8">
          <a href="/" className="text-lg hover:text-gray-600 dark:hover:text-gray-400">
            Home
          </a>
          <a href="/dashboard" className="text-lg hover:text-gray-600 dark:hover:text-gray-400">
            Dashboard
          </a>
          <a href="/about" className="text-lg hover:text-gray-600 dark:hover:text-gray-400">
            About
          </a>
        </div>
      )}

      {/* Right: Theme Toggle + User Actions */}
      <div className="flex items-center space-x-6">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? (
            <FaSun className="text-yellow-500" size={20} />
          ) : (
            <FaMoon className="text-gray-800 dark:text-white" size={20} />
          )}
        </button>

        {/* User Actions */}
        {!isAuthPage && isLoggedIn ? (
          <div className="relative">
            {/* Dropdown Toggle */}
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-full focus:outline-none"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              <h1>{userName} </h1>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-md rounded-lg"
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <a
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Profile
                </a>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          (!isAuthPage && 
            <a
            href="/login"
            className="bg-green-500 hover:bg-white dark:hover:bg-black hover:underline hover:text-green-500 border hover:border border-green-500 text-white px-4 py-2 rounded-full"
          >
            Sign In
          </a>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;
