import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || "Terjadi kesalahan, silakan coba lagi.";
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

export default api;
