import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaList, FaTv, FaChevronDown, FaChevronRight, FaTrophy, FaChartBar, FaClipboardList, FaCogs, FaBars } from "react-icons/fa";

// eslint-disable-next-line react/prop-types
const AdminSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const { user } = useSelector((state) => state.auth);

  const toggleMenu = (menu) => {
    // Jika sidebar tertutup, buka sidebar terlebih dahulu
    if (isCollapsed) {
      setIsCollapsed(false);
    }
    // Toggle menu seperti biasa
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Header Sidebar */}
      <div className="m-2 sidebar-header">
        {!isCollapsed && (
          <>
            <h5>Dashboard Antrian</h5>
            <hr />
          </>
        )}
      </div>

      {/* Menu: Antrian */}
      <div>
        <button
          onClick={() => toggleMenu("antrian")}
          className="btn shadow-sm w-100 text-start mb-2 d-flex align-items-center justify-content-between"
        >
          <span>
            <FaList className="me-2" />
            {!isCollapsed && "Antrian"}
          </span>
          {!isCollapsed && (openMenu === "antrian" ? <FaChevronDown /> : <FaChevronRight />)}
        </button>
        <div className={`sidebar-menu ${openMenu === "antrian" ? "show" : ""}`}>
          <div className="ms-3 my-2 d-grid gap-2">
            <NavLink to="/dashboard/queue-list" className="btn shadow-sm d-flex align-items-center">
              <FaClipboardList className="me-2" />
              <span>Daftar Antrian</span>
            </NavLink>
            {user?.role === "hc" && (
              <NavLink to="/dashboard/queue-report" className="btn shadow-sm d-flex align-items-center">
                <FaChartBar className="me-2" />
                <span>Report Antrian</span>
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Menu HC (Human Capital) */}
      {user?.role === "hc" && (
        <div>
          {/* Menu: Monitor */}
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
            <div className={`sidebar-menu ${openMenu === "monitor" ? "show" : ""}`}>
              <div className="ms-3 my-2 d-grid gap-2">
                <NavLink to="/leaderboard" className="btn shadow-sm d-flex align-items-center">
                  <FaTrophy className="me-2" />
                  <span>Leaderboard</span>
                </NavLink>
                <NavLink to="/queue-display" className="btn shadow-sm d-flex align-items-center">
                  <FaTv className="me-2" />
                  <span>Display Antrian</span>
                </NavLink>
                <NavLink to="/queue-menu" className="btn shadow-sm d-flex align-items-center">
                  <FaBars className="me-2" />
                  <span>Menu Layanan</span>
                </NavLink>
              </div>
            </div>
          </div>

          {/* Menu: Pengaturan */}
          <div>
            <button
              onClick={() => toggleMenu("settings")}
              className="btn shadow-sm w-100 text-start mb-2 d-flex align-items-center justify-content-between"
            >
              <span>
                <FaCogs className="me-2" />
                {!isCollapsed && "Pengaturan"}
              </span>
              {!isCollapsed && (openMenu === "settings" ? <FaChevronDown /> : <FaChevronRight />)}
            </button>
            <div className={`sidebar-menu ${openMenu === "settings" ? "show" : ""}`}>
              <div className="ms-3 my-2 d-grid gap-2">
                <NavLink to="/dashboard/queue-settings-display" className="btn shadow-sm d-flex align-items-center">
                  <FaTv className="me-2" />
                  <span>Display Antrian</span>
                </NavLink>
                <NavLink to="/dashboard/queue-settings-menu" className="btn shadow-sm d-flex align-items-center">
                  <FaBars className="me-2" />
                  <span>Menu Layanan</span>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;
