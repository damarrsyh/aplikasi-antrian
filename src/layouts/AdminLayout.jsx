import Sidebar from "../components/Admin/AdminSidebar";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/Admin/AdminNavbar";
import AdminFooter from "../components/Admin/AdminFooter";

const AdminLayout = () => {
  return (
    <div className="d-flex flex-column vh-100">
      <AdminNavbar />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <div className="flex-grow-1 p-4 bg-light">
          <Outlet /> {/* Ini akan menampilkan halaman konten admin */}
        </div>
      </div>
      <AdminFooter />
    </div>
  );
};

export default AdminLayout;
