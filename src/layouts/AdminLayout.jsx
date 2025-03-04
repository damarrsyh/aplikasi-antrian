import { useState } from "react";
import Sidebar from "../components/Admin/AdminSidebar";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/Admin/AdminNavbar";
import AdminFooter from "../components/Admin/AdminFooter";

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="d-flex flex-column vh-100">
      {/* Navbar dengan tombol toggle sidebar */}
      <AdminNavbar toggleSidebar={toggleSidebar} />

      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <Sidebar isCollapsed={isSidebarCollapsed} />

        {/* Main Content */}
        <div
          className="flex-grow-1 p-4 transition-all"
          style={{
            transition: "margin-left 0.3s ease-in-out",
          }}
        >
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <AdminFooter />
    </div>
  );
};

export default AdminLayout;
