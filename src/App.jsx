import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import MultiTabSync from "./components/MultiTabSync";
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/style.css'

const App = () => {
  return (
    <BrowserRouter>
      <MultiTabSync />
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
