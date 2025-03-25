import { configureStore } from "@reduxjs/toolkit";
import queueReducer from "./Slice/queueSlice";
import themeReducer from "./Slice/themeSlice";
import authReducer from "./Slice/authSlice";
import authNewReducer from "./Slice/queueNewSlice";
import reportReducer from "./Slice/reportSlice";
import queueNewReducer from "./Slice/queueNewSlice";

const store = configureStore({
  reducer: {
    queue: queueReducer,
    queueNew: queueNewReducer,
    theme: themeReducer,
    auth: authReducer,
    authNew: authNewReducer,
    report: reportReducer,
  }
});

export default store;