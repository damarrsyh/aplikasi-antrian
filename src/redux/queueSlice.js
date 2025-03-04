import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProcessedQueues, changeQueueStatus } from "../components/Admin/TestQueueActions"; 

// Async Thunk untuk mengambil daftar antrian dari API
export const fetchQueueList = createAsyncThunk("queue/fetchQueueList", async (_, { rejectWithValue }) => {
  try {
    const data = await getProcessedQueues();
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Terjadi kesalahan");
  }
});

// Async Thunk untuk memperbarui status antrian
export const updateQueueStatus = createAsyncThunk(
  "queue/updateQueueStatus",
  async ({ queueId, newStatus }, { rejectWithValue }) => {
    try {
      await changeQueueStatus(queueId, newStatus);
      return { queueId, newStatus };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Gagal memperbarui status");
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
      .addCase(updateQueueStatus.fulfilled, (state, action) => {
        state.queueList = state.queueList.map((operator) => ({
          ...operator,
          queues: operator.queues.map((queue) =>
            queue.id === action.payload.queueId
              ? { ...queue, status: action.payload.newStatus }
              : queue
          ),
        }));
      });
  },
});

export const { setCurrentQueue } = queueSlice.actions;
export default queueSlice.reducer;
