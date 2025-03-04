import { useState, useEffect } from "react";

const useTheme = () => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) return storedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const [darkMode, setDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.setAttribute("data-bs-theme", darkMode ? "dark" : "light");

    // Efek transisi yang lebih rapi
    document.body.style.transition = "background-color 0.3s ease, color 0.3s ease";
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return { darkMode, toggleTheme };
};

export default useTheme;
