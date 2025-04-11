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
  (error) => {
    // Jika error 403 dan message-nya "Invalid token", redirect ke /login
    if (
      error.response?.status === 403 &&
      error.response?.data?.message === 'Invalid token.'
    ) {
      localStorage.removeItem('token'); // hapus token lama
      window.location.href = '/login'; // redirect
    }
    return Promise.reject(error);
  }
);

export default api;
