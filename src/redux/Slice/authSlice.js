import { createSlice } from "@reduxjs/toolkit";

// Cek apakah user sudah login di localStorage
const userFromStorage = JSON.parse(localStorage.getItem("user")) || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userFromStorage,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!userFromStorage,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = { ...action.payload.user, status: "active"};
      state.token = action.payload.token;
      state.isAuthenticated = true;

      console.log("User berhasil login", action.payload.user) ;

      // Simpan ke localStorage agar tetap login saat refresh
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      if (state.user) {
        state.user.status = "inactive";
      }
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Hapus dari localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.setItem("logout", Date.now());
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
