import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createTicketApi, updateQueueStatus, fetchQueues } from "../api/queueApi";

// Async Thunk untuk mengambil daftar antrian dari API
export const fetchQueueList = createAsyncThunk("queue/fetchQueueList", async (_, { rejectWithValue }) => {
  try {
    const data = await fetchQueues();
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Terjadi kesalahan");
  }
});


// Async Thunk untuk mengupdate daftar antrian dari API
export const updateQueueStatusThunk = createAsyncThunk(
  "queue/updateQueueStatus",
  async (updatedQueue, { rejectWithValue }) => {
    console.log("📌 Data yang dikirim ke updateQueueStatus:", updatedQueue); // DEBUGGING
    if (!updatedQueue || !updatedQueue.id) {
      console.error("❌ updateQueueStatusThunk gagal: id tidak ditemukan");
      return rejectWithValue("id tidak ditemukan");
    }

    try {
      const response = await updateQueueStatus(updatedQueue.id, updatedQueue);
      console.log("✅ Update sukses:", response);
      return response;
    } catch (error) {
      console.error("❌ Gagal memperbarui status:", error);
      return rejectWithValue(error.response?.data || "Gagal memperbarui status");
    }
  }
);

// Async Thunk untuk membuat tiket baru
export const createQueueTicket = createAsyncThunk(
  "queue/createQueueTicket",
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await createTicketApi(customerData);
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
      if (!action.payload || !action.payload.queue_id) {
        return;
      }
      const queueList = state.queueList || [];
      const queueToUpdate = queueList.find(queue => queue.queue_id === action.payload.queue_id);
      if (!queueToUpdate) {
        return;
      }
      const index = queueList.findIndex(queue => queue.queue_id === action.payload.queue_id);
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
