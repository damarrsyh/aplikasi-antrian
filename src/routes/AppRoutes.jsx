import { Route, Routes } from 'react-router-dom'
import ServicePage from "../pages/Service/ServicePage"

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<ServicePage/>}/>
      </Routes>
    </>
  )
}

export default AppRoutes
