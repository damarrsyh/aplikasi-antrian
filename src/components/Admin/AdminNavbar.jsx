import { Navbar, Container, Nav, Dropdown, Button, Image } from "react-bootstrap";
import { FaSun, FaMoon, FaUsers, FaBars } from "react-icons/fa"; 
import useTheme from "../Shared/useTheme";

// eslint-disable-next-line react/prop-types
const AdminNavbar = ({ toggleSidebar }) => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <Navbar 
      expand="lg" 
      className="shadow-sm"
    >
      <Container fluid className="mx-4">
        {/* Logo & Brand */}
        <div className="d-flex align-items-center">
          <Navbar.Brand href="/" className="d-flex align-items-center">
            <FaUsers className="me-2" />
            <span className="fw-bold me-5">Antrian</span>
          </Navbar.Brand>
          <Button variant={darkMode ? "text-light" : "text-dark"} className="me-2" onClick={toggleSidebar}>
            <FaBars />
          </Button>
        </div>

        {/* Profil & Theme Toggle */}
        <Nav className="ms-auto d-flex align-items-center">
          {/* Toggle Dark/Light Mode */}
          <Button 
            variant={darkMode ? "text-light" : "text-dark"} 
            onClick={toggleTheme} 
            className="rounded-circle pb-2"
          >
            {darkMode ? <FaSun size={15} /> : <FaMoon size={15} />}
          </Button>
          
          {/* Dropdown Profile */}
          <Dropdown align="end">
            <Dropdown.Toggle 
              variant="transparent" 
              id="dropdown-profile"
              className="mx-2"
            >
              Admin
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="/settings">Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href="/logout">Logout</Dropdown.Item>
            </Dropdown.Menu>
            <Image src="/profile.jpg" alt="Profile" roundedCircle width="30" height="30"/>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
