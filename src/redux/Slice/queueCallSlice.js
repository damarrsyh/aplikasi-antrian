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
  },
});

export const { setCalledQueue } = queueCallSlice.actions;
export default queueCallSlice.reducer;