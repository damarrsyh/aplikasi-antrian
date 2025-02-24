import { configureStore } from "@reduxjs/toolkit";
import queueReducer from "./queueSlice";
import themeReducer from "./themeSlice";

const store = configureStore({
  reducer: {
    queue: queueReducer,
    theme: themeReducer,
  }
});

export default store;