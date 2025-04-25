import api from "../utils/api";
import { loginSuccess, logout } from "../redux/Slice/authSlice";
import Cookies from "js-cookie";

//  LOGIN API  //

// Fungsi helper untuk menangani error API
const handleApiError = (error) => {
  if (error.response) {
    console.error("API Error:", error.response.data);
    throw new Error(error.response.data?.message || `Error: ${error.response.status}`);
  } else if (error.request) {
    console.error("No Response from Server");
    throw new Error("Server tidak merespons. Coba lagi nanti.");
  } else {
    console.error("Request Error:", error.message);
    throw new Error("Terjadi kesalahan dalam permintaan.");
  }
};

export const loginUser = (email, password, counter) => async (dispatch) => {
  try {
    const response = await api.post("/api/users/login", { email, password });

    const token = response.data.token;

    // Simpan token ke cookies (expired otomatis 8 jam)
    Cookies.set("token", token, { expires: 1 / 3 });

    // Simpan token & user ke localStorage (opsional, untuk akses lainnya)
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({
      user: response.data.namalengkap,
      email: response.data.email,
      counter: counter
    }));

    dispatch(loginSuccess(response.data));
  } catch (error) {
    handleApiError(error);
  }
};

// **LOGOUT USER**
export const logoutUser = () => (dispatch) => {
  Cookies.remove("token"); // Hapus dari cookies
  localStorage.removeItem("token"); // Hapus dari localStorage
  localStorage.removeItem("user");

  dispatch(logout());
};

//  END LOGIN API  //



// ANTRIAN API //

// **AMBIL DATA CUSTOMER**
export const fetchCustomers = async () => {
  try {
    const response = await api.get("/queue/customer");
    // console.log("Data Customer", response.data); DEBUGGING
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// **AMBIL DATA JENIS ANTRIAN**
export const fetchType = async () => {
  try {
    const response = await api.get("/queue/type");
    // console.log("Data Type Antrian", response.data)
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export const updateTypeStatus = async (slug, aktif) => {
  try {
    const response = await api.put(`/queue/jenis-antrian/${slug}`, { aktif });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// **BUAT TIKET ANTRIAN**
export const createQueueTicket = async (type, nama, telp) => {
  try {
    const response = await api.post(`/queue/tiket?type=${type}&nama=${nama}&telp=${telp}`);
    // console.log("Response Tiket:", response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// PANGGIL DATA ANTRIAN MENUNGGU
export const fetchQueueWait = async () => {
  try {
    const response = await api.get("/queue/menunggu");
    // console.log("Data Menunggu", response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

// PANGGIL ANTRIAN
export const callQueue = async (counter, type, nomor) => {
  try {
    // Ambil data user dari localStorage dan parse
    const storedUser = localStorage.getItem("user");
    const userData = storedUser ? JSON.parse(storedUser) : null;

    if (!userData) throw new Error("User data tidak ditemukan di localStorage");

    const { user, email } = userData; // Ambil user dan email

    // Kirim request POST dengan body yang sesuai
    const response = await api.post(
      `/queue/panggil?counter=${counter}&type=${type}&nomor=${nomor}`,
      { user, email } // Request body
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// PANGGIL ULANG ANTRIAN
export const recallQueue = async (counter, type, nomor) => {
  try {
    const response = await api.post("/queue/panggil-ulang", {
      counter,
      type,
      nomor,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


// PANGGIL DATA LIVE ANTRIAN
export const fetchQueueLive = async () => {
  try {
    const response = await api.get("/queue/live");
    // console.log("Data Live", response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

// PANGGIL DATA ANTRIAN SELESAI
export const fetchQueueDone = async () => {
  try {
    const response = await api.get("/queue/selesai");
    // console.log("Data Selesai", response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

// END ANTRIAN API //



// REPORT ANTRIAN API //

export const fetchQueueDateNow = async () => {
  try {
    const response = await api.get("/queue/date");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export const fetchMonthlyReport = async (bulan) => {
  try {
    const response = await api.get(`/queue/monthly-report?bulan=${bulan}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

// END REPORT ANTRIAN API //

