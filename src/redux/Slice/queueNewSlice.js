import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCustomers, fetchType, updateTypeStatus, fetchQueueWait, fetchQueueDone, fetchQueueDateNow, fetchQueueLive } from "../../api/queueNewApi";

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
      // console.log("Data redux type antrian", data);
      return data;
    }catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal mengambil data jenis antrian");
    }
  }
);

export const toggleQueueTypeStatus = createAsyncThunk(
  "queue/toggleQueueTypeStatus",
  async ({ jenisAntrian, currentStatus }, { rejectWithValue }) => {
    try {
      const slugMap = {
        "Siap print": "siap_print",
        "Design/Edit/Kreatif": "design",
        "Fotocopy/Jilid/Scan": "fotocopy",
        "Online Pick-up": "online",
        "Retur Penjualan": "retur",
        "Tamu/Supplier": "tamu",
      };

      const slug = slugMap[jenisAntrian];
      const newStatus = currentStatus === "Y" ? "N" : "Y";

      const result = await updateTypeStatus(slug, newStatus);
      return { jenisAntrian, newStatus, result }; // bisa juga return slug jika ingin mapping ulang
    } catch (error) {
      return rejectWithValue(error.message);
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
      // console.log("Data Live Redux", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal mengambil daftar antrian Live");
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

// Thunk untuk mengambil antrian berdasarkan tanggal hari ini
export const getQueueDateNow = createAsyncThunk(
  "queueNew/getQueueDateNow",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchQueueDateNow();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Gagal mengambil data antrian tanggal hari ini");
    }
  }
);

const queueNewSlice = createSlice({
  name: "queueNew",
  initialState: {
    customers: [],
    type: [],
    queueWait: [],
    queueLive: [],
    queueDone: [],
    queueDateNow: [],
    loadingCustomers: false,
    loadingType: false,
    loadingQueueWait: false,
    loadingQueueLive: false,
    loadingQueueDone: false,
    loadingQueueDateNow: false,
    errorCustomers: null,
    errorType: null,
    errorQueueWait: null,
    errorQueueLive: null,
    errorQueueDone: null,
    errorQueueDateNow: null,
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
      // console.log("API Type Antrian", action.payload)
      state.loadingType = false;
      state.type = action.payload;
    })
    .addCase(getType.rejected, (state, action) => {
      state.loadingType = false;
      state.errorType = action.payload;
    })

    .addCase(toggleQueueTypeStatus.pending, (state) => {
      state.loadingType = true;
    })
    .addCase(toggleQueueTypeStatus.fulfilled, (state, action) => {
      const { jenisAntrian, newStatus } = action.payload;

      // Update status aktif di cachedData
      const index = state.type.cachedData.findIndex(
        (item) => item.jenis_antrian === jenisAntrian
      );
      if (index !== -1) {
        state.type.cachedData[index].aktif = newStatus;
      }

      state.loadingType = false;
      state.errorType = null;
    })
    .addCase(toggleQueueTypeStatus.rejected, (state, action) => {
      state.loadingType = false;
      state.errorType = action.payload || "Gagal update jenis layanan.";
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
      // console.log("API Live Success:", action.payload);
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

    // ✅ State untuk data antrian tanggal sekarang
    .addCase(getQueueDateNow.pending, (state) => {
      state.loadingQueueDateNow = true;
      state.errorQueueDateNow = null;
    })
    .addCase(getQueueDateNow.fulfilled, (state, action) => {
      // console.log("Data Now Success:", action.payload);
      state.loadingQueueDateNow = false;
      state.queueDateNow = action.payload;
    })
    .addCase(getQueueDateNow.rejected, (state, action) => {
      state.loadingQueueDateNow = false;
      state.errorQueueDateNow = action.payload;
    });
  },
});

export default queueNewSlice.reducer;
