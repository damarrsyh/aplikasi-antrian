import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchQueueReport, fetchUsers } from "../../api/queueApi";

// Thunk untuk mengambil laporan antrian dari API
export const fetchReport = createAsyncThunk("report/fetchReport", async (_, { rejectWithValue }) => {
  try {
    const data = await fetchQueueReport();
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Gagal mengambil laporan");
  }
});

export const fetchLeaderboard = createAsyncThunk("report/fetchLeaderboard", async (_, { rejectWithValue }) => {
  try {
    const data = await fetchUsers(); // Ambil data dari API

    // Sort berdasarkan jumlah SPK tertinggi, lalu ambil 10 data teratas
    let topOperators = data
      .filter(user => user.role === "operator") // Hanya ambil operator
      .map(user => ({
        ...user,
        jumlah_spk: user.jumlah_spk + Math.floor(Math.random() * 5 - 2), // Ubah SPK (±2)
        jumlah_complaint: Math.max(0, user.jumlah_complaint + Math.floor(Math.random() * 3 - 1)), // Ubah Complaint (±1)
        total_pendapatan: user.total_pendapatan + Math.floor(Math.random() * 50000 - 25000), // Ubah Pendapatan (±25K)
        winRate: user.jumlah_spk > 0 
          ? Math.round((user.jumlah_spk / (user.jumlah_spk + user.jumlah_complaint)) * 100) 
          : 0, // Hitung Win Rate
      }))
      .sort((a, b) => b.winRate - a.winRate) // Urutkan berdasarkan Win Rate tertinggi
      .slice(0, 10);
      
      topOperators = topOperators.sort(() => Math.random() - 0.5);

    return topOperators; // Kembalikan 10 operator terbaik
  } catch (error) {
    console.error("Error fetching leaderboard:", error.message);
    return rejectWithValue(error.response?.data || "Gagal mengambil leaderboard");
  }
});


const reportSlice = createSlice({
  name: "report",
  initialState: {
    totalCustomers: 0,
    avgWaitTime: "0h 0m 0s",
    avgServiceTime: "0h 0m 0s",
    queuePerformance: [],
    leaderboard: [],
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
    })
    .addCase(fetchLeaderboard.pending, (state) => {
      state.status = "loading";
    })
    .addCase(fetchLeaderboard.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.leaderboard = action.payload; // Simpan data users apa adanya
    })
    .addCase(fetchLeaderboard.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });
  },
});

export default reportSlice.reducer;
