import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaList, FaTv, FaChevronDown, FaChevronRight, FaTrophy } from "react-icons/fa";

// eslint-disable-next-line react/prop-types
const AdminSidebar = ({ isCollapsed }) => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div
      className={`d-flex flex-column p-2 transition-all ${isCollapsed ? "collapsed" : ""}`}
      style={{ width: isCollapsed ? "90px" : "250px", overflow: "hidden", transition: "width 0.3s ease-in-out"}}
    >
      <div className="m-2">
        {!isCollapsed && (
          <>
            <h5>Dashboard Antrian</h5>
            <p className="mb-0">List menu antrian</p>
            <hr />
          </>
        )}
      </div>

      {/* Antrian Menu */}
      <div>
        <button
          onClick={() => toggleMenu("antrian")}
          className="btn shadow-sm w-100 text-start mb-2 me-2 d-flex align-items-center justify-content-between"
        >
          <span>
            <FaList className="me-2" />
            {!isCollapsed && "Antrian"}
          </span>
          {!isCollapsed && (openMenu === "antrian" ? <FaChevronDown /> : <FaChevronRight />)}
        </button>
        <div className={`sidebar-menu ${!isCollapsed && openMenu === "antrian" ? "show" : ""}`}>
          <div className="ms-3 my-2 d-grid gap-2">
            <NavLink to="/admin/queue-list" className="btn shadow-sm d-flex align-items-center">
              <FaList className="me-2" /> Daftar Antrian
            </NavLink>
            <button onClick={() => window.open("/leaderboard", "_blank")} className="btn shadow-sm d-flex align-items-center">
              <FaTrophy className="me-2" /> Leaderboard
            </button>
          </div>
        </div>
      </div>

      {/* Monitor Menu */}
      <div>
        <button
          onClick={() => toggleMenu("monitor")}
          className="btn shadow-sm w-100 text-start mb-2 d-flex align-items-center justify-content-between"
        >
          <span>
            <FaTv className="me-2" />
            {!isCollapsed && "Monitor"}
          </span>
          {!isCollapsed && (openMenu === "monitor" ? <FaChevronDown /> : <FaChevronRight />)}
        </button>
        <div className={`sidebar-menu ${!isCollapsed && openMenu === "monitor" ? "show" : ""}`}>
          <div className="ms-3 my-2 d-grid gap-2">
            <button onClick={() => window.open("/queue-display", "_blank")} className="btn shadow-sm d-flex align-items-center">
              <FaTv className="me-2" /> Tampilan Antrian
            </button>
            <button onClick={() => window.open("/queue-menu", "_blank")} className="btn shadow-sm d-flex align-items-center">
              <FaTv className="me-2" /> Menu Antrian
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
