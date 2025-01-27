import React, { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded"
    >
      {theme === "light" ? <FaSun /> : <FaMoon />}
      <span>Switch to {theme === "light" ? "Dark" : "Light"} Mode</span>
    </button>
  );
};

export default ThemeToggle;
