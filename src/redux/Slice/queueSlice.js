import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { createTicketApi, updateQueueStatus, fetchQueues } from "../../api/queueApi";

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
    // console.log("📌 Data yang dikirim ke updateQueueStatus:", updatedQueue); // DEBUGGING
    if (!updatedQueue || !updatedQueue.id) {
      console.error("❌ updateQueueStatusThunk gagal: id tidak ditemukan");
      return rejectWithValue("id tidak ditemukan");
    }

    try {
      const response = await updateQueueStatus(updatedQueue.id, updatedQueue);
      // console.log("✅ Update sukses:", response); // DEBUGGING
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

const queueAdapter = createEntityAdapter({
  selectId: (queue) => queue.id,
});

const initialState = queueAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const { selectAll: selectAllQueues, selectById: selectQueueById } = queueAdapter.getSelectors(
  (state) => state.queue
);

// Perbarui reducer untuk menggunakan adapter
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
      .addCase(fetchQueueList.fulfilled, (state, action) => {
        state.status = "succeeded";
        queueAdapter.setAll(state, action.payload);
      })
      .addCase(updateQueueStatusThunk.fulfilled, (state, action) => {
        queueAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload,
        });
      })
      .addCase(createQueueTicket.fulfilled, (state, action) => {
        queueAdapter.addOne(state, action.payload);
      });
  },
});

export const { setCurrentQueue } = queueSlice.actions;
export default queueSlice.reducer;
