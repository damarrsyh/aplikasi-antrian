// FILE INI UNTUK TEST TAMPILAN DATA DENGAN API

import { fetchQueues, updateQueueStatus, createTicketApi } from "../../api/queueApi";

export const getProcessedQueues = async () => {
  const data = await fetchQueues();
  return data.map((queue) => ({
    id: queue.queue_id, // Gunakan queue_id sebagai ID utama
    customerName: queue.customer?.name ?? "Unknown", 
    customerEmail: queue.customer?.email ?? "N/A",
    customerPhone: queue.customer?.phone ?? "N/A",
    serviceId: queue.service?.id ?? "Unknown",
    serviceName: queue.service?.name?.toString() ?? "Unknown Service",
    status: queue.status ?? "Unknown",
    createdAt: queue.created_at ? new Date(queue.created_at).toLocaleString() : new Date().toLocaleString(), // Format lebih user-friendly
  }));
};


export const changeQueueStatus = async (queueId, newStatus, queueNumber) => {
  return await updateQueueStatus(queueId, newStatus, queueNumber);
};

export const createTicket = async (ticketData) => {
  try {
    const response = await createTicketApi(ticketData);
    return {...response, 
      id: response.queue_id}
  } catch (error) {
    console.error("Error in createTicket:", error);
    throw error;
  }
};
