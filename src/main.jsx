import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRoutes from './routes/AppRoutes.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/style.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoutes/>
  </StrictMode>,
)
