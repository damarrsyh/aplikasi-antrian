// FILE INI UNTUK TEST TAMPILAN DATA DENGAN API

import { fetchQueues, updateQueueStatus, createTicketApi } from "../../api/queueApi";

export const getProcessedQueues = async () => {
  const data = await fetchQueues();
  return data.map((queue) => ({
    id: queue.queue_id,
    customerName: queue.customer?.name || "Unknown", // Cegah error jika customer undefined
    customerEmail: queue.customer?.email || "N/A",
    customerPhone: queue.customer?.phone || "N/A",
    serviceId: queue.service?.id || "Unknown",
    serviceName: queue.service?.name?.toString() || "Unknown Service", // Pastikan string
    status: queue.status || "Unknown",
    createdAt: queue.created_at || new Date().toISOString(),
  }));
};

export const changeQueueStatus = async (queueId, newStatus) => {
  return await updateQueueStatus(queueId, newStatus);
};

export const createTicket = async (ticketData) => {
  try {
    const response = await createTicketApi(ticketData);
    return response;
  } catch (error) {
    console.error("Error in createTicket:", error);
    throw error;
  }
};
