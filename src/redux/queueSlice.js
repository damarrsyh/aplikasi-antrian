import { createSlice } from "@reduxjs/toolkit";

const queueSlice = createSlice({
  name: "queue",
  initialState: {
    tickets: [],
  },
  reducers: {
    addTicket: (state, action) => {
      state.tickets.push(action.payload);
    },
    removeTicket: (state) => {
      state.tickets.shift();
    }
  }
});

export const {addTicket, removeTicket } = queueSlice.actions;
export default queueSlice.reducer;