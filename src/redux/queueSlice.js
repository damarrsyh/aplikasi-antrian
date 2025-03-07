import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { changeQueueStatus, createTicket } from "../components/Admin/TestQueueActions";
import { fetchQueues } from "../api/queueApi";

// Async Thunk untuk mengambil daftar antrian dari API
export const fetchQueueList = createAsyncThunk("queue/fetchQueueList", async (_, { rejectWithValue }) => {
  try {
    const data = await fetchQueues();
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Terjadi kesalahan");
  }
});

export const updateQueueStatusThunk = createAsyncThunk(
  "queue/updateQueueStatus",
  async ({ queueId, newStatus, queueNumber, customerName, serviceName }, { rejectWithValue }) => {
    try {
      await changeQueueStatus(queueId, newStatus, queueNumber, customerName, serviceName);
      
      const updatedQueues = await fetchQueues(); // Ambil data lengkap lagi
      const updatedQueue = updatedQueues.find((q) => q.queue_id === queueId);
      
      return updatedQueue || { queueId, newStatus, queueNumber, customerName, serviceName };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Gagal memperbarui status");
    }
  }
);

// Async Thunk untuk membuat tiket baru
export const createQueueTicket = createAsyncThunk(
  "queue/createQueueTicket",
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await createTicket(ticketData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Gagal membuat tiket");
    }
  }
);

const initialState = {
  queueList: [],
  currentQueue: null,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const queueSlice = createSlice({
  name: "queue",
  initialState,
  reducers: {
    setCurrentQueue: (state, action) => {
      state.currentQueue = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQueueList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchQueueList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.queueList = action.payload.map(queue => ({
          ...queue,
          queue_number: queue.queue_number || queue.customer?.queue_number || "N/A",
          customer_name: queue.customer_name || queue.customer?.customer_name || "N/A",
          service_name: queue.service_name || queue.service?.service_name || "N/A"
        }));
      })
      .addCase(fetchQueueList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateQueueStatusThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateQueueStatusThunk.fulfilled, (state, action) => {
        const index = state.queueList.findIndex(queue => queue.queue_id === action.payload.queue_id);
        if (index !== -1) {
          state.queueList[index] = { ...state.queueList[index], ...action.payload };
        }
      })
      .addCase(updateQueueStatusThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createQueueTicket.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createQueueTicket.fulfilled, (state, action) => {
        state.status = "successed";
        state.queueList.push(action.payload);
      })
      .addCase(createQueueTicket.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setCurrentQueue } = queueSlice.actions;
export default queueSlice.reducer;
