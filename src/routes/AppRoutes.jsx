import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import QueueListPage from "../pages/admin/QueueListPage";
// import QueueReportPage from "../pages/admin/QueueReportPage";
import QueueSettingsDisplayPage from "../pages/admin/QueueSettingsDisplayPage";
import QueueSettingsMenuPage from "../pages/admin/QueueSettingsMenuPage";
import QueueDisplayPage from "../pages/display/QueueDisplayPage";
import QueueMenuPage from "../pages/display/QueueMenuPage";
import LeaderboardPage from "../pages/Admin/LeaderboardPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect default ke queue-list */}
        <Route path="/" element={<Navigate to="/admin/queue-list" replace />} />
        
        {/* Rute untuk Admin & Leaderboard */}
        <Route path="/admin" element={<AdminLayout />}> 
          <Route path="queue-list" element={<QueueListPage />} />
          {/* <Route path="queue-report" element={<QueueReportPage />} /> */}
          <Route path="queue-settings-display" element={<QueueSettingsDisplayPage />} />
          <Route path="queue-settings-menu" element={<QueueSettingsMenuPage />} />
        </Route>
          <Route path="leaderboard" element={<LeaderboardPage/>}/>
        
        {/* Rute untuk Customer */}
        <Route path="/queue-display" element={<QueueDisplayPage />} />
        <Route path="/queue-menu" element={<QueueMenuPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
