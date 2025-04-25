import { createSlice } from "@reduxjs/toolkit";

const queueCallSlice = createSlice({
  name: "queueCall",
  initialState: {
    calledQueue: null,
    audioQueue: [],
    isPlaying: false,
  },
  reducers: {
    setCalledQueue: (state, action) => {
      state.calledQueue = action.payload;
    },
    queueAudioSequence: (state, action) => {
      state.audioQueue.push(action.payload);
    },
    dequeueAudioSequence: (state) => {
      state.audioQueue.shift();
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    clearQueue: (state) => {
      state.audioQueue = [];
      state.calledQueue = null;
      state.isPlaying = false;
    },
  },
});

export const {
  setCalledQueue,
  queueAudioSequence,
  dequeueAudioSequence,
  setIsPlaying,
  clearQueue
} = queueCallSlice.actions;

export default queueCallSlice.reducer;
