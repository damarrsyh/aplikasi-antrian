import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import QueueListPage from "../pages/admin/QueueListPage";

// BELUM DIGUNAKAN KARENA BELUM SELESAI

// import QueueReportPage from "../pages/admin/QueueReportPage";
// import QueueSettingsDisplayPage from "../pages/admin/QueueSettingsDisplayPage";
// import QueueSettingsMenuPage from "../pages/admin/QueueSettingsMenuPage";


import QueueDisplayPage from "../pages/display/QueueDisplayPage";
import QueueMenuPage from "../pages/display/QueueMenuPage";
import LeaderboardPage from "../pages/Admin/LeaderboardPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect default ke queue-list */}
        <Route path="/" element={<Navigate to="/admin/queue-list" replace />} />
        
        {/* Rute untuk List Antrian */}
        <Route path="/admin" element={<AdminLayout />}> 
          <Route path="queue-list" element={<QueueListPage />} />

          {/* BELUM DIGUNAKAN KARENA BELUM SELESAI */}
          
          {/* <Route path="queue-report" element={<QueueReportPage />} />
          <Route path="queue-settings-display" element={<QueueSettingsDisplayPage />} />
          <Route path="queue-settings-menu" element={<QueueSettingsMenuPage />} /> */}

          {/* BELUM DIGUNAKAN KARENA BELUM SELESAI */}
          
        </Route>
        
        {/* Rute untuk Customer & leaderboard */}
        <Route path="leaderboard" element={<LeaderboardPage/>}/>
        <Route path="/queue-display" element={<QueueDisplayPage />} />
        <Route path="/queue-menu" element={<QueueMenuPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
