import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchQueues = async () => {
  try {
    const response = await axios.get(`${API_URL}/operators`);
    return response.data;
  } catch (error) {
    console.error("Error fetching queues:", error);
    return [];
  }
};

export const updateQueueStatus = async (queueId, status) => {
  try {
    const response = await axios.put(`${API_URL}/queues/${queueId}`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating queue status:", error);
    return null;
  }
};

export const createQueue = async (customerData) => {
    try {
      const response = await axios.post(`${API_URL}/queues`, customerData);
      return response.data;
    } catch (error) {
      console.error("Error creating queue:", error);
      return null;
    }
  };
