import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../redux/Slice/themeSlice";

const useTheme = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.setAttribute("data-bs-theme", darkMode ? "dark" : "light");
    document.body.style.transition = "background-color 0.3s ease, color 0.3s ease";
  }, [darkMode]);

  return { darkMode, toggleTheme: () => dispatch(toggleTheme()) };
};

export default useTheme;
