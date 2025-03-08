import axios from "axios";

const API_URL = import.meta.env.VITE_API_TEST_URL;

// GET DATA ANTRIAN

export const fetchQueues = async () => {
  try {
    const response = await axios.get(`${API_URL}/queues`);
    console.log("Response fetchQueues:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching queues:", error);
    return [];
  }
};

// UPDATE DATA ANTRIAN (PANGGIL-IN PROGRESS) -> (SELESAI-COMPLETE)

export const updateQueueStatus = async (id, updatedData) => {
  try {
    console.log("Queue ID:", id);
    const response = await axios.put(`${API_URL}/queues/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating queue status:", error);
    return null;
  }
};

// POST TIKET DATA ANTRIAN

export const createTicketApi = async (customerData) => {
  
  try {
    const response = await axios.post(`${API_URL}/queues`, customerData);
    return response.data;
  } catch (error) {
    console.error("Error creating queue:", error.response?.data || error.message);
    return null; 
  }
};
