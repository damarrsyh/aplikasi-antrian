import { configureStore } from "@reduxjs/toolkit";
import monitorReducer from "./Slice/monitorSlice";
import queueCallReducer from "./Slice/queueCallSlice";

const store = configureStore ({
  reducer: {
    monitor: monitorReducer,
    queueCall: queueCallReducer,
  }
});

export default store;