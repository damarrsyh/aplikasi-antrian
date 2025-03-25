import { Navbar, Container, Dropdown, Button, Image } from "react-bootstrap";
import { FaSun, FaMoon, FaUsers, FaBars, FaCog, FaSignOutAlt } from "react-icons/fa"; 
import useTheme from "../Shared/useTheme";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../api/queueNewApi";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const AdminNavbar = ({ toggleSidebar, setShowModal }) => {
  const { darkMode, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
 };

  return (
    <Navbar expand="lg" className="shadow-sm">
      <Container fluid className="mx-3 d-flex justify-content-between align-items-center">
        {/* Kiri: Logo & Sidebar Button */}
        <div className="d-flex align-items-center">
          <Navbar.Brand href="/" className="d-flex align-items-center me-3 brand-responsive">
            <FaUsers className="me-2" />
            <span className="fw-bold brand-text">Antrian</span>
          </Navbar.Brand>
          
          {/* Satu Button untuk Sidebar (Modal di Mobile, Toggle di Desktop) */}
          <Button 
            variant=""
            onClick={() => window.innerWidth < 768 ? setShowModal(true) : toggleSidebar()}
          >
            <FaBars />
          </Button>
        </div>

        {/* Kanan: Toggle Theme & Profile Dropdown */}
        <div className="d-flex align-items-center">
          {/* Theme Toggle */}
          <Button 
            variant="light" 
            onClick={toggleTheme} 
            className="theme-toggle rounded-circle d-none d-md-inline"
            style={{ width: "35px", height: "35px" }}
          >
            {darkMode ? <FaSun size={15} /> : <FaMoon size={15} />}
          </Button>

          {/* Dropdown Profile */}
          <Dropdown align="end" className="ms-3 d-flex align-items-center profile-dropdown">
            <span className="me-2">
              {user?.role} - {user?.loket || "All"}
            </span>
            <Dropdown.Toggle 
              variant="transparent" 
              id="dropdown-profile" 
              className="p-0 border-0 bg-transparent profile-toggle"
            >
              <Image 
                src="/profile.jpg" 
                alt="Profile" 
                roundedCircle 
                width="36" 
                height="36"
                className="profile-avatar"
              />
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-custom">
              <Dropdown.Item href="/settings">
                <FaCog className="me-2 text-primary" /> Settings
              </Dropdown.Item>
              <Dropdown.Item onClick={toggleTheme} className="d-lg-none d-md-none">
                {darkMode ? <FaSun className="me-2 text-warning" /> : <FaMoon className="me-2 text-secondary" />}
                {darkMode ? "Light Mode" : "Dark Mode"}
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className="text-danger">
                <FaSignOutAlt className="me-2" /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
