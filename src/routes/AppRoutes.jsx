import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import QueueListPage from "../pages/Admin/QueueListPage";
import QueueReportPage from "../pages/Admin/QueueReportPage";
import QueueSettingsDisplayPage from "../pages/Admin/QueueSettingsDisplayPage";
import QueueSettingsMenuPage from "../pages/Admin/QueueSettingsMenuPage";
import LeaderboardPage from "../pages/LeaderboardPage";
import QueueDisplayPage from "../pages/Display/QueueDisplayPage";
import QueueMenuPage from "../pages/Service/QueueMenuPage";
import LoginForm from "../components/LoginForm";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import ProtectedRoute from "./ProtectedRoute"; // ⬅️ Pastikan ini di-import
import { useSelector } from "react-redux";

const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Halaman Login */}
      <Route path="/login" element={<LoginForm />} />

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard/queue-list" : "/login"} replace />} />

      {/* Halaman Unauthorized */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route path="queue-list" element={<QueueListPage />} />
          <Route path="queue-report" element={<QueueReportPage />} />
          <Route path="queue-settings-display" element={<QueueSettingsDisplayPage />} />
          <Route path="queue-settings-menu" element={<QueueSettingsMenuPage />} />
        </Route>

        {/* Halaman yang hanya bisa diakses jika login */}
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Route>

      {/* Halaman Customer (bisa diakses tanpa login, jika memang demikian) */}
      <Route path="/queue-display" element={<QueueDisplayPage />} />
      <Route path="/queue-menu" element={<QueueMenuPage />} />
    </Routes>
  );
};

export default AppRoutes;
