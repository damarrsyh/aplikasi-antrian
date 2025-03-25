import api from "../utils/api";
import { loginSuccess, logout } from "../redux/Slice/authSlice";

// Fungsi helper untuk menangani error API
const handleApiError = (error) => {
  if (error.response) {
    // Server memberikan respons dengan status selain 2xx
    console.error("API Error:", error.response.data);
    throw new Error(error.response.data?.message || `Error: ${error.response.status}`);
  } else if (error.request) {
    // Request dikirim tetapi tidak mendapat respons
    console.error("No Response from Server");
    throw new Error("Server tidak merespons. Coba lagi nanti.");
  } else {
    // Kesalahan saat mengatur request
    console.error("Request Error:", error.message);
    throw new Error("Terjadi kesalahan dalam permintaan.");
  }
};

// **LOGIN USER**
export const loginUser = (email, password) => async (dispatch) => {
  try {
    const response = await api.post("/api/users/login", { email, password });

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify({
      namalengkap: response.data.namalengkap,
      email: response.data.email,
    }));

    dispatch(loginSuccess(response.data));
  } catch (error) {
    handleApiError(error);
  }
};

// **LOGOUT USER**
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  dispatch(logout());
};

// **AMBIL DATA CUSTOMER**
export const fetchCustomers = async () => {
  try {
    const response = await api.get("/customer");
    console.log("Data Customer", response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// **BUAT TIKET ANTRIAN**
export const createQueueTicket = async (type, nama, telp) => {
  try {
    const response = await api.post(`/tiket?type=${type}&nama=${nama}&telp=${telp}`);
    console.log("Response Tiket:", response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// **AMBIL KODE NEGARA**
export const fetchCountryCodes = async () => {
  try {
    const response = await api.get("https://restcountries.com/v3.1/all");
    return response.data
      .map((country) => ({
        code: country.idd?.root
          ? `${country.idd.root}${country.idd.suffixes ? country.idd.suffixes[0] : ""}`
          : null,
        name: country.name.common,
        flag: country.flag,
      }))
      .filter((c) => c.code);
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

// **AMBIL JENIS LAYANAN ANTRIAN**
export const fetchQueuesType = async () => {
  try {
    const response = await api.get("/type");
    console.log("Data Services", response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// **AMBIL ANTRIAN BERDASARKAN TANGGAL**
export const fetchQueuesByDate = async (tanggal) => {
  try {
    const response = await api.get(`/by-date?tanggal=${tanggal}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// **AMBIL DETAIL ANTRIAN BERDASARKAN TANGGAL, JENIS LAYANAN, DAN NOMOR**
export const fetchQueueDetail = async (tanggal, type, nomor) => {
  try {
    const response = await api.get(`/by-date?tanggal=${tanggal}&type=${type}&nomor=${nomor}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
