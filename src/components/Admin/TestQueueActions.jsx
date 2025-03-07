// FILE INI UNTUK TEST TAMPILAN DATA DENGAN API

import { fetchQueues, updateQueueStatus, createTicketApi } from "../../api/queueApi";

export const getProcessedQueues = async () => {
  try {
    const data = await fetchQueues();
    return data.map((queue) => ({
      id: queue.queue_id || null,
      customerName: queue.customer?.customer_name || null,
      customerEmail: queue.customer?.email || null,
      customerPhone: queue.customer?.phone || null,
      serviceId: queue.service?.id || null,
      serviceName: queue.service?.serivce_name?.toString() || null,
      status: queue.status || "Unknown",
      createdAt: queue.created_at ? new Date(queue.created_at).toLocaleString() : new Date().toLocaleString(),
    }));
  } catch (error) {
    console.error("Error fetching queues:", error);
    return [];
  }
};

export const changeQueueStatus = async (
  queueId, 
  newStatus, 
  queueNumber,
  customerName,
  serviceName,
) => {
  try {
    return await updateQueueStatus(queueId, newStatus, queueNumber, customerName, serviceName);
  } catch (error) {
    console.error(`Failed to update queue ${queueId}:`, error);
    throw error;
  }
};

export const createTicket = async (ticketData) => {
  try {
    const response = await createTicketApi(ticketData);
    return { ...response, id: response.queue_id };
  } catch (error) {
    console.error("Error in createTicket:", error);
    throw new Error("Failed to create ticket");
  }
};

