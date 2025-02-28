// FILE INI UNTUK TEST TAMPILAN DATA DENGAN API

import { fetchQueues, updateQueueStatus, createTicketApi } from "../../api/queueApi";

export const getProcessedQueues = async () => {
  const data = await fetchQueues();

  // Ubah struktur data jika diperlukan
  const processedData = data.map((operator) => ({
    operatorId: operator.id,
    operatorName: operator.name,
    operatorCounter: operator.counters,
    queues: operator.queues.map((queue) => ({
      id: queue.queue_id,
      customerName: queue.customer.name,
      customerEmail: queue.customer.email,
      customerPhone: queue.customer.phone,
      serviceId: queue.service.id,
      serviceName: queue.service.name,
      status: queue.status,
      operatorCounter: operator.counters,
      createdAt: queue.created_at,
    })),
  }));

  return processedData;
};

export const changeQueueStatus = async (queueId, newStatus) => {
  return await updateQueueStatus(queueId, newStatus);
};

export const createTicket = async (ticketData) => {
  return await createTicketApi(ticketData);
};
