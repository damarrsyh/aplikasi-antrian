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

let isSyncing = false;

export const syncOfflineTickets = async () => {
  if (isSyncing) return; // Cegah double sync

  isSyncing = true;
  const offlineTickets = getOfflineTickets();

  for (const ticket of offlineTickets) {
    try {
      const response = await api.post(`/queue/tiket?type=${ticket.type}&nama=${ticket.nama}&telp=${ticket.telp}`);
      console.log("✅ Tiket berhasil disinkronkan ke server:", response.data);
      removeOfflineTicket(ticket); 
    } catch (error) {
      console.error("❌ Gagal sinkronkan tiket:", error);
    }
  }

  isSyncing = false;
};

export const useSyncOfflineTickets = () => {
  useEffect(() => {
    const handleOnline = () => {
      console.log("✅ Koneksi kembali online, mencoba sync tiket...");
      syncOfflineTickets();
    };

    window.addEventListener('online', handleOnline);

    // Optional: Kalau mau langsung sync kalau pas pertama load udah online
    if (navigator.onLine) {
      handleOnline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);
};

