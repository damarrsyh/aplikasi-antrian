
// FILE INI UNTUK TEST TAMPILAN DATA DENGAN API

import { fetchQueues, updateQueueStatus } from "../../api/queueApi";

export const getProcessedQueues = async () => {
  const data = await fetchQueues();

  // Ubah struktur data jika diperlukan
  const processedData = data.map((operator) => ({
    operatorId: operator.id,
    operatorName: operator.name,
    queues: operator.queues.map((queue) => ({
      id: queue.queue_id,
      customerName: queue.customer.name,
      customerEmail: queue.customer.email,
      customerPhone: queue.customer.phone,
      serviceId: queue.service.id,
      serviceName: queue.service.name,
      status: queue.status,
      createdAt: queue.created_at,
    })),
  }));

  return processedData;
};

export const changeQueueStatus = async (queueId, newStatus) => {
  return await updateQueueStatus(queueId, newStatus);
};
