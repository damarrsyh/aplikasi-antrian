import { useState, useEffect } from "react";
import AdminSidebar from "../components/layouts/AdminSidebar"; // Sesuaikan dengan nama file sidebar
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/layouts/AdminNavbar";
import AdminFooter from "../components/layouts/AdminFooter";

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    JSON.parse(localStorage.getItem("sidebarCollapsed")) || false
  );

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="d-flex flex-column vh-100 position-relative">
      {/* Navbar dengan tombol toggle sidebar */}
      <div className="position-sticky top-0 w-100" style={{ zIndex: 1050 }}>
        <AdminNavbar toggleSidebar={toggleSidebar} />
      </div>

      <div className="d-flex flex-grow-1">
        {/* Sidebar dengan kemampuan toggle */}
        <AdminSidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />

        {/* Main Content */}
        <div
          className={`main-content flex-grow-1 p-3 ${isSidebarCollapsed ? "collapsed" : ""}`}
          style={{
            transition: "margin-left 0.3s ease-in-out, background-color 0.3s ease-in-out",
          }}
        >
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div className="position-sticky bottom-0 w-100" style={{ zIndex: 1050 }}>
        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;
