import api from "../utils/api";
import { loginSuccess, logout } from "../redux/Slice/authSlice";

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

    localStorage.setItem("token", response.data.token);
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
    // console.log("Data Customer", response.data); DEBUGGING
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// **AMBIL DATA JENIS ANTRIAN**
export const fetchType = async () => {
  try {
    const response = await api.get("/type");
    // console.log("Data Type Antrian", response.data)
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
      `/panggil?counter=${counter}&type=${type}&nomor=${nomor}`,
      { user, email } // Request body
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// PANGGIL DATA LIVE ANTRIAN
export const fetchQueueLive = async () => {
  try {
    const response = await api.get("/live");
    // console.log("Data Live", response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

// PANGGIL DATA ANTRIAN SELESAI
export const fetchQueueDone = async () => {
  try {
    const response = await api.get("/selesai");
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
    const response = await api.get("/date");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

// END REPORT ANTRIAN API //

