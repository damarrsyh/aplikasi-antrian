/* eslint-disable no-unused-vars */
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaList, FaPhone, FaChartBar, FaCog, FaTv, FaThList, FaChevronDown, FaChevronRight, FaTools } from "react-icons/fa";

const AdminSidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="d-flex flex-column bg-light p-3" style={{ width: "250px", borderRight: "1px solid #D3D3D3" }}>
      <h5 className="mb-4">Admin Menu</h5>
      
      {/* Antrian Menu */}
      <div>
        <button
          onClick={() => toggleMenu("antrian")}
          className="btn btn-light shadow-sm w-100 text-start mb-2 d-flex align-items-center justify-content-between"
        >
          <span><FaList className="me-2" /> Antrian</span>
          {openMenu === "antrian" ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        {openMenu === "antrian" && (
          <div className="ms-3 my-2 d-grid gap-2">
            <NavLink to="/admin/queue-list" className="btn btn-light shadow-sm d-flex align-items-center">
              <FaList className="me-2" /> Daftar Antrian
            </NavLink>
            {/* <NavLink to="/admin/call-queue" className="btn btn-light shadow-sm d-flex align-items-center">
              <FaPhone className="me-2" /> Panggil Antrian
            </NavLink> */}
            {/* <NavLink to="/admin/queue-report" className="btn btn-light shadow-sm d-flex align-items-center">
              <FaChartBar className="me-2" /> Laporan Antrian
            </NavLink> */}
            <NavLink to="/admin/queue-settings-display" className="btn btn-light shadow-sm d-flex align-items-center">
              <FaCog className="me-2" /> Pengaturan Layar
            </NavLink>
            <NavLink to="/admin/queue-settings-menu" className="btn btn-light shadow-sm d-flex align-items-center">
              <FaTools className="me-2" /> Pengaturan Menu
            </NavLink>
          </div>
        )}
      </div>
      
      {/* Monitor Menu */}
      <div>
        <button
          onClick={() => toggleMenu("monitor")}
          className="btn btn-light shadow-sm w-100 text-start mb-2 d-flex align-items-center justify-content-between"
        >
          <span><FaTv className="me-2" /> Monitor</span>
          {openMenu === "monitor" ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        {openMenu === "monitor" && (
          <div className="ms-3 my-2 d-grid gap-2">
            <button 
              onClick={() => window.open("/queue-display", "_blank")} 
              className="btn btn-light shadow-sm d-flex align-items-center"
            >
              <FaTv className="me-2" /> Tampilan Antrian
            </button>
            <button 
              onClick={() => window.open("/queue-menu", "_blank")} 
              className="btn btn-light shadow-sm d-flex align-items-center"
            >
              <FaThList className="me-2" /> Menu Antrian
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;
