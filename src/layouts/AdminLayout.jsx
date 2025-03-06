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
    <div className="d-flex flex-column vh-100 position-relative">
      {/* Navbar dengan tombol toggle sidebar */}
      <div className="position-sticky top-0 w-100" style={{zIndex: 1050 }}>
        <AdminNavbar toggleSidebar={toggleSidebar} />
      </div>

      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <Sidebar isCollapsed={isSidebarCollapsed} />

        {/* Main Content */}
        <div
          className="flex-grow-1 p-3 transition-all"
          style={{
            transition: "margin-left 0.3s ease-in-out, background-color 0.3s ease-in-out",
          }}
        >
          <Outlet/>
        </div>
      </div>

      {/* Footer */}
      <div className="position-sticky bottom-0 w-100" style={{ zIndex: 1050 }}>
        <AdminFooter/>
      </div>
    </div>
  );
};

export default AdminLayout;
