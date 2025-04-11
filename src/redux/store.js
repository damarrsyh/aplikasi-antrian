import { configureStore } from "@reduxjs/toolkit";
import queueReducer from "./Slice/queueSlice";
import themeReducer from "./Slice/themeSlice";
import authReducer from "./Slice/authSlice";
import reportReducer from "./Slice/reportSlice";
import queueNewReducer from "./Slice/queueNewSlice";
import queueCallReducer from "./Slice/queueCallSlice";

const store = configureStore({
  reducer: {
    queue: queueReducer,
    queueNew: queueNewReducer,
    theme: themeReducer,
    auth: authReducer,
    report: reportReducer,
    queueCall: queueCallReducer,
  }
});

export default store;