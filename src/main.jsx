import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux";
import store from "./redux/store.js"
import AppRoutes from './routes/AppRoutes.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/style.css'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  </StrictMode>
);
