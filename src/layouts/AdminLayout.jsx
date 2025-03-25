import { useState, useEffect } from "react";
import AdminSidebar from "../components/layouts/AdminSidebar"; 
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/layouts/AdminNavbar";
import AdminFooter from "../components/layouts/AdminFooter";
import { Container } from "react-bootstrap";

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    JSON.parse(localStorage.getItem("sidebarCollapsed")) || false
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  return (
    <Container fluid className="d-flex flex-column min-vh-100 p-0">
      {/* Navbar */}
      <div className="position-fixed top-0 w-100 shadow-sm bg-white" style={{ zIndex: 1050 }}>
        <AdminNavbar 
          toggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)} 
          setShowModal={setShowModal} 
        />
      </div>

      {/* Content Wrapper */}
      <div className="d-flex flex-grow-1 pt-5">
        {/* Sidebar (Modal for mobile) */}
        <AdminSidebar 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed} 
          showModal={showModal} 
          setShowModal={setShowModal}
        />

        {/* Main Content */}
        <div className={`main-content ${isSidebarCollapsed ? "full-width" : ""}`}>
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div className="w-100 mt-auto">
        <AdminFooter />
      </div>
    </Container>
  );
};

export default AdminLayout;
