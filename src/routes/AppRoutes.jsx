import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import QueueListPage from "../pages/admin/QueueListPage";
import QueueReportPage from "../pages/admin/QueueReportPage";
import QueueSettingsDisplayPage from "../pages/admin/QueueSettingsDisplayPage";
import QueueSettingsMenuPage from "../pages/admin/QueueSettingsMenuPage";
import LeaderboardPage from "../pages/admin/LeaderboardPage";
import QueueDisplayPage from "../pages/display/QueueDisplayPage";
import QueueMenuPage from "../pages/display/QueueMenuPage";
import LoginForm from "../components/LoginForm";
import UnauthorizedPage from "../pages/Admin/UnauthorizedPage";
import ProtectedRoute from "./ProtectedRoute";
import { useSelector } from "react-redux";

const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Halaman Login */}
      <Route path="/login" element={<LoginForm />} />

      {/* Proteksi untuk Operator */}
      <Route element={<ProtectedRoute allowedRoles={["operator", "hc"]} />}>
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route path="queue-list" element={<QueueListPage />} />
        </Route>
      </Route>

      {/* Proteksi untuk Human Capital */}
      <Route element={<ProtectedRoute allowedRoles={["hc"]} />}>
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route path="queue-report" element={<QueueReportPage />} />
          <Route path="queue-settings-display" element={<QueueSettingsDisplayPage />} />
          <Route path="queue-settings-menu" element={<QueueSettingsMenuPage />} />
        </Route>
      </Route>

      {/* Redirect Default */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/admin/queue-list" replace /> : <Navigate to="/login" replace />} />

      {/* Halaman Unauthorized */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Halaman Customer */}
      <Route path="/queue-display" element={<QueueDisplayPage />} />
      <Route path="/queue-menu" element={<QueueMenuPage />} />
      <Route path="leaderboard" element={<LeaderboardPage />} />
    </Routes>
  );
};

export default AppRoutes;
