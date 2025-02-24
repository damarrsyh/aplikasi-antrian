import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import QueueDisplayPage from "../pages/Display/QueueDisplayPage"
import QueueSettingsDisplayPage from "../pages/Display/QueueSettingsDisplayPage"
import QueueSettingsMenuPage from "../pages/Display/QueueSettingsMenuPage"
import QueueMenuPage from "../pages/Display/QueueMenuPage"
import CallQueuePage from "../pages/Queue/CallQueuePage"
import QueueListPage from "../pages/Queue/QueueListPage"
import QueueReportPage from "../pages/Queue/QueueReportPage"

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Queue Pages */}
        <Route path="/" element={<QueueListPage/>}/>
        <Route path="/queue-list" element={<QueueListPage/>}/>
        <Route path="/call-queue" element={<CallQueuePage/>}/>
        <Route path="/queue-report" element={<QueueReportPage/>}/>
        {/* Display Pages */}
        <Route path="/queue-menu-settings" element={<QueueSettingsMenuPage/>}/>
        <Route path="/queue-menu" element={<QueueMenuPage/>}/>
        <Route path="/queue-display-settings" element={<QueueSettingsDisplayPage/>}/>
        <Route path="/queue-display" element={<QueueDisplayPage/>}/>
      </Routes>
    </Router>
  )
}

export default AppRoutes
