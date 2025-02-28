import { useState, useEffect } from "react";

const useTheme = () => {
  const getInitialTheme = () => localStorage.getItem("theme") === "dark";
  const [darkMode, setDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return { darkMode, toggleTheme };
};

export default useTheme;
