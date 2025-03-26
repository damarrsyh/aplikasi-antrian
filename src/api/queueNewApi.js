import api from "../utils/api";
import { loginSuccess, logout } from "../redux/Slice/authSlice";

//  LOGIN API  //

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

//  END LOGIN API  //



// ANTRIAN API //

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

// **AMBIL DATA JENIS ANTRIAN**
export const fetchType = async () => {
  try {
    const response = await api.get("/type");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

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

// PANGGIL DATA ANTRIAN MENUNGGU
export const fetchQueueWait = async () => {
  try {
    const response = await api.get("/menunggu");
    console.log("Data Menunggu", response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

// PANGGIL DATA LIVE ANTRIAN
export const fetchQueueLive = async () => {
  try {
    const response = await api.get("/live");
    console.log("Data Live", response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

// PANGGIL DATA ANTRIAN SELESAI
export const fetchQueueDone = async () => {
  try {
    const response = await api.get("/selesai");
    console.log("Data Selesai", response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

// END ANTRIAN API //



// REPORT ANTRIAN API //

export const fetchQueueByDate = async (tanggal, type, nomor) => {
  try {
    const response = await api.get(`/by-date`, {
      params: { tanggal, type, nomor },
    });
    // console.log("Data Antrian", response.data);
    return response.data; // Hanya mengambil data yang dibutuhkan
  } catch (error) {
    console.error("Error fetching queue:", error);
    throw error; // Melempar error agar bisa ditangani di komponen
  }
};

// END REPORT ANTRIAN API //

