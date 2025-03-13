import { createSlice } from '@reduxjs/toolkit';

// Ambil tema dari localStorage atau gunakan preferensi sistem
const getInitialTheme = () => {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) return storedTheme === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    darkMode: getInitialTheme(),
  },
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("theme", state.darkMode ? "dark" : "light");

      // Update langsung ke atribut body
      document.body.classList.toggle("dark-mode", state.darkMode);
      document.body.setAttribute("data-bs-theme", state.darkMode ? "dark" : "light");
    }
  }
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
