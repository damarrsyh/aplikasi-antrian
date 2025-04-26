import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchQueueDone } from "../../api/monitorApi";

export const getQueueDone = createAsyncThunk(
  "monitor/getQueueDone",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchQueueDone();
      // console.log("Data Selesai Redux", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal mengambil daftar antrian selesai");
    }
  }
);

const monitorSlice = createSlice({
  name: "monitor",
  initialState: {
    queueDone: [],
    queueDateNow: [],
    loadingQueueDone: false,
    errorQueueDone: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    // ✅ State untuk daftar antrian selesai
    .addCase(getQueueDone.pending, (state) => {
      state.loadingQueueDone = true;
      state.errorQueueDone = null;
    })
    .addCase(getQueueDone.fulfilled, (state, action) => {
      // console.log("API Done Success:", action.payload);
      state.loadingQueueDone = false;
      state.queueDone = action.payload;
    })
    .addCase(getQueueDone.rejected, (state, action) => {
      state.loadingQueueDone = false;
      state.errorQueueDone = action.payload;
    });
  },
});

export default monitorSlice.reducer;