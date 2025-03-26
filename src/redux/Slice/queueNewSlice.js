import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCustomers, fetchType, fetchCountryCodes, fetchQueueWait, fetchQueueDone, fetchQueueByDate, fetchQueueLive } from "../../api/queueNewApi";

// Thunk untuk mengambil daftar pelanggan
export const getCustomers = createAsyncThunk(
  "queueNew/getCustomers",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchCustomers();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal mengambil daftar customer");
    }
  }
);

// Thunk untuk mengambil jenis antrian
export const getType = createAsyncThunk(
  "queueNew/getType",
  async(_, {rejectWithValue}) => {
    try {
      const data = await fetchType();
      return data;
    }catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal mengambil data jenis antrian");
    }
  }
);

// Thunk untuk mengambil kode negara
export const fetchCountryCodesThunk = createAsyncThunk(
  "queueNew/fetchCountryCodes",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchCountryCodes();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal mengambil kode negara");
    }
  }
);

export const getQueueWait = createAsyncThunk(
  "queueNew/getQueueWait",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchQueueWait();
      // console.log("Data Menunggu Redux", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal mengambil daftar antrian menunggu");
    }
  }
);

export const getQueueLive = createAsyncThunk(
  "queueNew/getQueueLive",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchQueueLive();
      console.log("Data Live Redux", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal mengambil daftar antrian selesai");
    }
  }
);

export const getQueueDone = createAsyncThunk(
  "queueNew/getQueueDone",
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

// Thunk untuk mengambil antrian berdasarkan tanggal
export const fetchQueueByDateThunk = createAsyncThunk(
  "queueNew/fetchQueueByDate",
  async ({ tanggal, type, nomor }, { rejectWithValue }) => {
    try {
      const response = await fetchQueueByDate(tanggal, type, nomor);
      return response.length > 0 ? response[0].data || [] : [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal mengambil data antrian");
    }
  }
);

const queueNewSlice = createSlice({
  name: "queueNew",
  initialState: {
    customers: [],
    type: [],
    countryCodes: [],
    queueWait: [],
    queueLive: [],
    queueDone: [],
    queuesByDate: [],
    loadingCustomers: false,
    loadingCountryCodes: false,
    loadingQueueWait: false,
    loadingQueueLive: false,
    loadingQueueDone: false,
    loadingQueuesByDate: false,
    errorCustomers: null,
    errorCountryCodes: null,
    errorQueueWait: null,
    errorQueueLive: null,
    errorQueueDone: null,
    errorQueuesByDate: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ State untuk daftar customer
      .addCase(getCustomers.pending, (state) => {
        state.loadingCustomers = true;
        state.errorCustomers = null;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.loadingCustomers = false;
        state.customers = action.payload;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.loadingCustomers = false;
        state.errorCustomers = action.payload;
      })

      // ✅ State untuk daftar customer
      .addCase(getType.pending, (state) => {
        state.loadingType = true;
        state.errorType = null;
      })
      .addCase(getType.fulfilled, (state, action) => {
        state.loadingType = false;
        state.type = action.payload;
      })
      .addCase(getType.rejected, (state, action) => {
        state.loadingType = false;
        state.errorType = action.payload;
      })

      // ✅ State untuk kode negara
      .addCase(fetchCountryCodesThunk.pending, (state) => {
        state.loadingCountryCodes = true;
        state.errorCountryCodes = null;
      })
      .addCase(fetchCountryCodesThunk.fulfilled, (state, action) => {
        state.loadingCountryCodes = false;
        state.countryCodes = action.payload;
      })
      .addCase(fetchCountryCodesThunk.rejected, (state, action) => {
        state.loadingCountryCodes = false;
        state.errorCountryCodes = action.payload;
      })

      // ✅ State untuk daftar antrian menunggu
      .addCase(getQueueWait.pending, (state) => {
        state.loadingQueueWait = true;
        state.errorQueueWait = null;
      })
      .addCase(getQueueWait.fulfilled, (state, action) => {
        // console.log("API Wait Success:", action.payload);
        state.loadingQueueWait = false;
        state.queueWait = action.payload;
      })
      .addCase(getQueueWait.rejected, (state, action) => {
        state.loadingQueueWait = false;
        state.errorQueueWait = action.payload;
      })

      // ✅ State untuk daftar live antrian
      .addCase(getQueueLive.pending, (state) => {
        state.loadingQueueLive = true;
        state.errorQueueLive = null;
      })
      .addCase(getQueueLive.fulfilled, (state, action) => {
        console.log("API Live Success:", action.payload);
        state.loadingQueueLive = false;
        state.queueLive = action.payload;
      })
      .addCase(getQueueLive.rejected, (state, action) => {
        state.loadingQueueLive = false;
        state.errorQueueLive = action.payload;
      })

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
      })

      // ✅ State untuk antrian berdasarkan tanggal & No
      .addCase(fetchQueueByDateThunk.pending, (state) => {
        state.loadingQueuesByDate = true;
        state.errorQueuesByDate = null;
      })
      .addCase(fetchQueueByDateThunk.fulfilled, (state, action) => {
        // console.log("API Success:", action.payload);
        state.loadingQueuesByDate = false;
        state.queuesByDate = action.payload; // ✅ Langsung menyimpan array data
      })
      .addCase(fetchQueueByDateThunk.rejected, (state, action) => {
        state.loadingQueuesByDate = false;
        state.errorQueuesByDate = action.payload;
      });
  },
});

export default queueNewSlice.reducer;
