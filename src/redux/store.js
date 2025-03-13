import { configureStore } from "@reduxjs/toolkit";
import queueReducer from "./Slice/queueSlice";
import themeReducer from "./Slice/themeSlice";
import authReducer from "./Slice/authSlice";
import reportReducer from "./Slice/reportSlice";

const store = configureStore({
  reducer: {
    queue: queueReducer,
    theme: themeReducer,
    auth: authReducer,
    report: reportReducer,
  }
});

export default store;