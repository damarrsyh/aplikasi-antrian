import { getOfflineTickets, removeOfflineTicket } from "../utils/offlineTickets";
import api from "../utils/api";
import { useEffect } from "react";

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

export const createQueueTicket = async (type, nama, telp) => {
  try {
    const response = await api.post(`/queue/tiket?type=${type}&nama=${nama}&telp=${telp}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const syncOfflineTickets = async () => {
  const offlineTickets = getOfflineTickets();
  for (const ticket of offlineTickets) {
    try {
      const response = await api.post(`/queue/tiket?type=${ticket.type}&nama=${ticket.nama}&telp=${ticket.telp}`);
      console.log("✅ Tiket berhasil disinkronkan ke server:", response.data);
      removeOfflineTicket(ticket); // Hapus tiket yang berhasil dikirim
    } catch (error) {
      console.error("❌ Gagal sinkronkan tiket:", error);
    }
  }
};

export const useSyncOfflineTickets = () => {
  const isOnline = navigator.onLine; // Cek status online atau offline

  useEffect(() => {
    if (isOnline) {
      syncOfflineTickets(); // Sinkronisasi tiket offline saat online
    }
  }, []); // Trigger ketika status online/offline berubah
};

