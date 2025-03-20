import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MultiTabSync from "./components/MultiTabSync";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';
import AppRoutes from "./routes/AppRoutes";

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
    },
  }
);

const App = () => {
  return (
    <RouterProvider router={router}>
      <MultiTabSync />
    </RouterProvider>
  );
};

export default App;
