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
  async ({ queueId, newStatus, queueNumber }, { rejectWithValue }) => {
    try {
      await changeQueueStatus(queueId, newStatus, queueNumber);
      
      const updatedQueues = await fetchQueues(); // Ambil data lengkap lagi
      const updatedQueue = updatedQueues.find((q) => q.queue_id === queueId);
      
      return updatedQueue || { queueId, newStatus, queueNumber };
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
        state.queueList = action.payload;
      })
      .addCase(fetchQueueList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateQueueStatusThunk.fulfilled, (state, action) => {
        state.queueList = state.queueList.map((queue) =>
          queue.id === action.payload.id ? { ...queue, ...action.payload } : queue
        );
      })
      .addCase(createQueueTicket.fulfilled, (state, action) => {
        state.queueList.push(action.payload);
      });
  },
});

export const { setCurrentQueue } = queueSlice.actions;
export default queueSlice.reducer;
