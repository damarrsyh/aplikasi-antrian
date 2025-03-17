import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { createTicketApi, updateQueueStatus, updateServiceStatus, fetchQueues, fetchServices, fetchCountryCodes } from "../../api/queueApi";

// Async Thunk untuk mengambil daftar antrian dari API
export const fetchQueueList = createAsyncThunk("queue/fetchQueueList", async (_, { rejectWithValue }) => {
  try {
    const data = await fetchQueues();
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Terjadi kesalahan");
  }
});

// Async Thunk untuk mengambil daftar layanan dari API
export const fetchServicesThunk = createAsyncThunk(
  "queue/fetchServices",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchServices();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Gagal mengambil layanan");
    }
  }
);

// Async Thunk untuk mendapatkan kode negara
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

// Async Thunk untuk Update Service Status Antrian
export const updateServiceStatusThunk = createAsyncThunk(
  "queue/updateServiceStatus",
  async ({ serviceId, newStatus }, { rejectWithValue }) => {
    try {
      const updatedService = await updateServiceStatus(serviceId, newStatus);
      return updatedService;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Gagal memperbarui status layanan");
    }
  }
);

// Async Thunk untuk mengupdate daftar antrian dari API
export const updateQueueStatusThunk = createAsyncThunk(
  "queue/updateQueueStatus",
  async (updatedQueue, { rejectWithValue }) => {
    if (!updatedQueue || !updatedQueue.id) {
      console.error("❌ updateQueueStatusThunk gagal: id tidak ditemukan");
      return rejectWithValue("id tidak ditemukan");
    }

    try {
      const response = await updateQueueStatus(updatedQueue.id, updatedQueue);
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

const initialState = {
  ...queueAdapter.getInitialState(),
  services: [],
  servicesStatus: {},
  countryCodes: [],
  status: "idle",
  error: null,
};

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
      .addCase(fetchServicesThunk.fulfilled, (state, action) => {
        state.services = action.payload;
        state.servicesStatus = action.payload.reduce((acc, service) => {
          acc[service.id] = service.status;
          return acc;
        }, {});
      })
      .addCase(fetchCountryCodesThunk.fulfilled, (state, action) => {
        state.countryCodes = action.payload;
      })
      .addCase(updateServiceStatusThunk.fulfilled, (state, action) => {
        const updatedService = action.payload;
        if (updatedService) {
          state.services = state.services.map((service) =>
            service.id === updatedService.id ? updatedService : service
          );
          state.servicesStatus[updatedService.id] = updatedService.status;
        }
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
