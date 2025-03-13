import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchQueueReport } from "../../api/queueApi";

// Thunk untuk mengambil laporan antrian dari API
export const fetchReport = createAsyncThunk("report/fetchReport", async (_, { rejectWithValue }) => {
  try {
    const data = await fetchQueueReport();
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Gagal mengambil laporan");
  }
});

const reportSlice = createSlice({
  name: "report",
  initialState: {
    totalCustomers: 0,
    avgWaitTime: "0h 0m 0s",
    avgServiceTime: "0h 0m 0s",
    queuePerformance: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReport.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReport.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.totalCustomers = action.payload.totalCustomers;
        state.avgWaitTime = action.payload.avgWaitTime;
        state.avgServiceTime = action.payload.avgServiceTime;
        state.queuePerformance = action.payload.queuePerformance;
      })
      .addCase(fetchReport.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default reportSlice.reducer;
