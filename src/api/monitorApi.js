import api from "../utils/api";

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

// PANGGIL DATA ANTRIAN SELESAI
export const fetchQueueDone = async () => {
  try {
    const response = await api.get("/queue/selesai");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}