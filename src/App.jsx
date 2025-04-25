import { createBrowserRouter, RouterProvider } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';
import AppRoutes from "./routes/AppRoutes";
import { useSyncOfflineTickets } from "./api/serviceApi";

const router = createBrowserRouter(
  [
    {
      path: "/*",
      element: <AppRoutes />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const App = () => {
  useSyncOfflineTickets();
  
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('React Router Future Flag Warning')
    ) {
      return; // skip this specific warning
    }
    originalWarn(...args); // keep other warnings
  };

  return <RouterProvider router={router} />;
};

export default App;