import { Navbar, Container, Dropdown, Button, Image } from "react-bootstrap";
import { FaSun, FaMoon, FaUsers, FaBars } from "react-icons/fa"; 
import useTheme from "./Shared/useTheme";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/Slice/authSlice";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const AdminNavbar = ({ toggleSidebar }) => {
  const { darkMode, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // Ambil user dari Redux
  console.log("Data user dari Redux:", user);

  const handleLogout = async () => {
    await logout();
    dispatch(logout());
    navigate("/login"); 
  };

  return (
    <Navbar expand="lg" className="shadow-sm">
      <Container fluid className="mx-4 d-flex justify-content-between align-items-center">
        {/* Kiri: Logo & Sidebar Button */}
        <div className="d-flex align-items-center">
          <Navbar.Brand href="/" className="d-flex align-items-center me-3">
            <FaUsers className="me-2" />
            <span className="fw-bold">Antrian</span>
          </Navbar.Brand>
          <Button 
            variant={darkMode ? "text-light" : "text-dark"} 
            className="me-2"
            onClick={toggleSidebar}
          >
            <FaBars />
          </Button>
        </div>

        {/* Kanan: Toggle Theme & Profile Dropdown */}
        <div className="d-flex align-items-center">
          {/* Theme Toggle */}
          <Button 
            variant={darkMode ? "text-light" : "text-dark"} 
            onClick={toggleTheme} 
            className="theme-toggle rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "35px", height: "35px" }}
          >
            {darkMode ? <FaSun size={15} /> : <FaMoon size={15} />}
          </Button>

          {/* Dropdown Profile */}
          <Dropdown align="end" className="ms-3 d-flex align-items-center">
            <span className="me-2">{user?.role} - {user?.loket || "All"}</span>
            <Dropdown.Toggle 
              variant="transparent" 
              id="dropdown-profile" 
              className="p-0 border-0 bg-transparent"
            >
              <Image 
                src="/profile.jpg" 
                alt="Profile" 
                rounded 
                width="30" 
                height="30"
              />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="/settings">Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
