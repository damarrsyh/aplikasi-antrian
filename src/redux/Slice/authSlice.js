import { createSlice } from "@reduxjs/toolkit";

// Cek apakah user sudah login sebelumnya dari localStorage
const userData = localStorage.getItem("user");
const token = localStorage.getItem("token");

const initialState = {
  user: userData ? JSON.parse(userData) : null,
  token: token || null,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
      loginSuccess: (state, action) => {
        console.log("Payload loginSuccess:", action.payload);
        state.user = { 
          namalengkap: action.payload.namalengkap, 
          email: action.payload.email,
          counter: action.payload.counter 
      };
        state.token = action.payload.token;
        state.isAuthenticated = true;
      },
      logout: (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
