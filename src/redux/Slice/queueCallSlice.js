import { createSlice } from "@reduxjs/toolkit";

const queueCallSlice = createSlice({
  name: "queueCall",
  initialState: {
    calledQueue: null,
  },
  reducers: {
    setCalledQueue: (state, action) => {
      state.calledQueue = action.payload;
    },
    // opsi clear jika mau reset:
    clearCalledQueue: (state) => {
      state.calledQueue = null;
    }
  }
});

export const { setCalledQueue, clearCalledQueue } = queueCallSlice.actions;
export default queueCallSlice.reducer;