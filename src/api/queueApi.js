import axios from "axios";

const API_URL = import.meta.env.VITE_API_TEST_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Fungsi Login → Cari user berdasarkan email & password

// eslint-disable-next-line no-unused-vars
export const login = async (email, password, loket) => {
  try {
    // Cari user di JSON Server berdasarkan email & password
    const response = await api.get(`/users?email=${email}&password=${password}`);

    if (response.data.length === 0) {
      throw new Error("Email atau password salah");
    }

    let user = response.data[0];
    
    // Tambahkan loket yang dipilih oleh user
    user = { ...user, loket, status: "active" };

    console.log("Data user setelah Update di API:", user);

    // Simpan user dan loket ke localStorage
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", "dummy-token"); // JSON Server tidak mendukung JWT

    await api.patch(`/users/${user.id}`, { status: "active" });

    return user;
  } catch (error) {
    throw error.message || "Login gagal, coba lagi.";
  }
};

// 🔹 Fungsi untuk mendapatkan data user dari localStorage
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// 🔹 Fungsi Logout → Hapus token & user
export const logout = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  
  if (user) {
    await api.patch(`/users/${user.id}`, { status: "inactive" }); // Update status User di API
  }

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

// 🔹 Interceptor untuk menyertakan token (Dummy karena JSON Server tidak pakai JWT)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


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
      .filter((c) => c.code); // Hanya ambil data yang memiliki kode telepon
  } catch (error) {
    console.error("Error fetching country codes:", error);
    return [];
  }
};

// GET DATA LAYANAN
export const fetchServices = async () => {
  try {
    const response = await api.get("/services");
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

// GET DATA USERS
export const fetchUsers = async () => {
  try {
    const response = await api.get("/users");
    
    // console.log("Full API Response:", response.data); // Debug: Tampilkan seluruh respons API
    
    const operators = response.data.filter(user => user.role === "operator");
    
    // console.log("Filtered Operators:", operators); // Debug: Pastikan hanya operator yang diambil
    
    return operators;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};


// 🔹 GET DATA ANTRIAN
export const fetchQueues = async () => {
  try {
    const response = await api.get("/queues");
    console.log("Response fetchQueues:", response.data); // DEBUGGING
    return response.data;
  } catch (error) {
    console.error("Error fetching queues:", error);
    return [];
  }
};

// UPDATE STATUS LAYANAN
export const updateServiceStatus = async (serviceId, newStatus) => {
  try {
    const response = await api.patch(`/services/${serviceId}`, { status: newStatus });
    return response.data;
  } catch (error) {
    console.error("Error updating service status:", error);
    return null;
  }
};

// 🔹 UPDATE DATA ANTRIAN (PANGGIL-IN PROGRESS) -> (SELESAI-COMPLETE)
export const updateQueueStatus = async (id, updatedData) => {
  try {
    const response = await api.put(`/queues/${id}`, {
      ...updatedData,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating queue status:", error);
    return null;
  }
};

// 🔹 POST TIKET DATA ANTRIAN
export const createTicketApi = async (customerData) => {
  try {
    const response = await api.post("/queues", customerData);
    return response.data;
  } catch (error) {
    console.error("Error creating queue:", error.response?.data || error.message);
    return null;
  }
};

const formatTime = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
};

// GET DATA REPORT 
export const fetchQueueReport = async () => {
  try {
    const response = await api.get("/queues");
    const data = response.data;

    // Total customer (jumlah antrian)
    const totalCustomers = data.length;

    // Hitung rata-rata waktu tunggu & pelayanan
    const waitTimes = data
      .filter(q => q.customer.status === "Complete")
      .map(q => new Date(q.updated_at) - new Date(q.created_at));
    const serviceTimes = data
      .filter(q => q.customer.status === "Complete")
      .map(q => new Date(q.customer.time_end) - new Date(q.customer.time_start));

    const avgWaitTime = waitTimes.length ? waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length : 0;
    const avgServiceTime = serviceTimes.length ? serviceTimes.reduce((a, b) => a + b, 0) / serviceTimes.length : 0;

    // Rata Rata antrian setiap harinya
    const groupedByDate = data.reduce((acc, q) => {
      const date = new Date(q.created_at).toISOString().split("T")[0]; // Ambil YYYY-MM-DD
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const queuePerformance = Object.entries(groupedByDate).map(([date, count]) => ({ date, count }));

    return { 
      totalCustomers, 
      avgWaitTime: formatTime(avgWaitTime), 
      avgServiceTime: formatTime(avgServiceTime), 
      queuePerformance 
    };
  } catch (error) {
    console.error("Error fetching report:", error);
    return null;
  }
};

export default api;
