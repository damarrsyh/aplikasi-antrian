import axios from "axios";

const API_URL = import.meta.env.VITE_API_TEST_URL;

export const fetchQueues = async () => {
  try {
    const response = await axios.get(`${API_URL}/queues`);
    console.log("Data API yang ditarik", response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching queues:", error);
    return [];
  }
};

export const updateQueueStatus = async (queueId, status, queueNumber, customerName, serviceName) => {
  try {
    console.log(`Mengirim update ke server: ID=${queueId}, Customer Name=${customerName}, Service=${serviceName} Status=${status}, Queue Number=${queueNumber}`); // Debugging
    const response = await axios.put(`${API_URL}/queues/${queueId}`, {
      status,
      queue_number: queueNumber,
      customer_name: customerName,
      service_name: serviceName,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating queue status:", error);
    return null;
  }
};

export const createTicketApi = async (customerData) => {
  
  try {
    const response = await axios.post(`${API_URL}/queues`, customerData);
    return response.data;
  } catch (error) {
    console.error("Error creating queue:", error.response?.data || error.message);
    return null; 
  }
};
