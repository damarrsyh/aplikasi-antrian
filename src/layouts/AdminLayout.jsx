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
    <Container fluid className="d-flex flex-column vh-100 position-relative p-0">
      {/* Navbar */}
      <div className="position-sticky top-0 w-100" style={{ zIndex: 1050 }}>
        <AdminNavbar 
          toggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)} 
          setShowModal={setShowModal} 
        />
      </div>

      <div className="d-flex flex-grow-1">
        {/* Sidebar dengan modal di mobile */}
        <AdminSidebar 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed} 
          showModal={showModal} 
          setShowModal={setShowModal}
        />

        {/* Main Content */}
        <div className="main-content flex-grow-1 p-3">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div className="bottom-0 w-100" style={{ zIndex: 1050 }}>
        <AdminFooter />
      </div>
    </Container>
  );
};

export default AdminLayout;
