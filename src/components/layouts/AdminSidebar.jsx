import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaList, FaTv, FaChevronDown, FaChevronRight, FaTrophy, FaChartBar, FaClipboardList, FaCogs, FaBars, FaTimes } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";

// eslint-disable-next-line react/prop-types
const AdminSidebar = ({ isCollapsed, setIsCollapsed, showModal, setShowModal }) => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
    setOpenMenu(openMenu === menu ? null : menu);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setShowModal(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setShowModal]);

  return (
    <div className={`sidebar d-none d-md-block ${isCollapsed ? "collapsed" : ""}`}>
      
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
              <NavLink to="/dashboard/queue-report" className="btn shadow-sm d-flex align-items-center">
                <FaChartBar className="me-2" />
                <span>Report Antrian</span>
              </NavLink>
          </div>
        </div>
      </div>

      {/* Menu HC (Human Capital) */}
        <div>
          {/* Menu: Monitor */}
          <div>
            <button
              onClick={() => toggleMenu("Display")}
              className="btn shadow-sm w-100 text-start mb-2 d-flex align-items-center justify-content-between"
            >
              <span>
                <FaTv className="me-2" />
                {!isCollapsed && "Display"}
              </span>
              {!isCollapsed && (openMenu === "Display" ? <FaChevronDown /> : <FaChevronRight />)}
            </button>
            <div className={`sidebar-menu ${openMenu === "Display" ? "show" : ""}`}>
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
                {!isCollapsed && "Settings"}
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
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header className="d-flex justify-content-between">
            <h5 className="m-0">Menu</h5>
            <Button variant="light" onClick={() => setShowModal(false)}>
              <FaTimes />
            </Button>
          </Modal.Header>
          <Modal.Body>
  {[
    {
      title: "List Antrian",
      items: [
        { to: "/dashboard/queue-list", icon: <FaList className="me-2" />, label: "Daftar Antrian" },
        { to: "/dashboard/queue-report", icon: <FaChartBar className="me-2" />, label: "Report Antrian" },
      ],
    },
    {
      title: "Display",
      items: [
        { to: "/leaderboard", icon: <FaTrophy className="me-2" />, label: "Leaderboard" },
        { to: "/queue-display", icon: <FaTv className="me-2" />, label: "Display Antrian" },
        { to: "/queue-menu", icon: <FaBars className="me-2" />, label: "Menu Layanan" },
      ],
    },
    {
      title: "Settings",
      items: [
        { to: "/dashboard/queue-settings-display", icon: <FaTv className="me-2" />, label: "Setting Display Antrian" },
        { to: "/dashboard/queue-settings-menu", icon: <FaBars className="me-2" />, label: "Setting Menu Layanan" },
      ],
    },
  ].map((section, idx) => (
    <div key={idx}>
      <span>{section.title}</span>
      {section.items.map((item, i) => (
        <NavLink
          key={i}
          to={item.to}
          className="btn my-2 d-flex align-items-center w-100"
          onClick={() => setShowModal(false)}
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
      {idx < 2 && <hr />} {/* tambahkan <hr> kecuali di section terakhir */}
    </div>
  ))}
</Modal.Body>

      </Modal>
    </div>
    
  );
};

export default AdminSidebar;
