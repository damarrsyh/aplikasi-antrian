import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor request untuk menambahkan token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor response untuk menangani error 401 (token expired)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Hapus token dari localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      // Redirect ke halaman login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
