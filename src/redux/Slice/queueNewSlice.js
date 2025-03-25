import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCustomers, fetchQueuesType, fetchCountryCodes } from "../../api/queueNewApi";


export const getCustomers = createAsyncThunk(
  "queueNew/getCustomers",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchCustomers();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Gagal mengambil daftar customer");
    }
  }
);

export const getQueuesType = createAsyncThunk(
  "queueNew/getQueuesType",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchQueuesType();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Gagal mengambil daftar jenis antrian");
    }
  }
);

export const fetchCountryCodesThunk = createAsyncThunk(
  "queue/fetchCountryCodes",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchCountryCodes();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Gagal mengambil kode negara");
    }
  }
);

const queueNewSlice = createSlice({
  name: "queueNew",
  initialState: {
    customers: [],
    queuesByDate: [],
    queuesType: [],
    countryCodes: [],
    queueDetail: null,
    loadingCustomers: false,
    loadingQueuesType: false,
    loadingCountryCodes: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getCustomers.pending, (state) => { 
      state.loadingCustomers = true;
    })
    .addCase(getCustomers.fulfilled, (state, action) => {
      state.loadingCustomers = false;
      state.customers = action.payload;
    })
    .addCase(getCustomers.rejected, (state, action) => {
      state.loadingCustomers = false;
      state.error = action.payload || "Gagal mengambil daftar customer";
    })

    .addCase(fetchCountryCodesThunk.pending, (state) => { 
      state.loadingCountryCodes = true;
    })
    .addCase(fetchCountryCodesThunk.fulfilled, (state, action) => {
      state.loadingCountryCodes = false;
      state.countryCodes = action.payload;
    })
    .addCase(fetchCountryCodesThunk.rejected, (state, action) => {
      state.loadingCountryCodes = false;
      state.error = action.payload || "Gagal mengambil kode negara";
    })

    .addCase(getQueuesType.pending, (state) => { 
      state.loadingQueuesType = true;
    })
    .addCase(getQueuesType.fulfilled, (state, action) => {
      state.loadingQueuesType = false;
      state.queuesType = action.payload;
    })
    .addCase(getQueuesType.rejected, (state, action) => {
      state.loadingQueuesType = false;
      state.error = action.payload || "Gagal mengambil daftar jenis antrian";
    });
  },
});

export default queueNewSlice.reducer;
