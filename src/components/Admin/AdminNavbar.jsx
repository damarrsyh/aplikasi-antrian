import { Navbar, Container, Nav, Dropdown, Button, Image } from "react-bootstrap";
import { FaSun, FaMoon, FaUsers } from "react-icons/fa"; 
import useTheme from "../Shared/useTheme"; // Import hook tema

const AdminNavbar = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <Navbar bg={darkMode ? "dark" : "light"} variant={darkMode ? "dark" : "light"} expand="lg" className="shadow-sm">
      <Container fluid className="mx-4">
        {/* Logo & Brand */}
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <FaUsers className="me-2"/>
          <span className="fw-bold">Antrian</span>
        </Navbar.Brand>

        {/* Profil & Theme Toggle */}
        <Nav className="ms-auto d-flex align-items-center">
          {/* Toggle Dark/Light Mode */}
          <Button variant={darkMode ? "bg-dark text-white" : "bg-light text-dark"} onClick={toggleTheme} className="rounded-circle">
            {darkMode ? <FaSun size={15} /> : <FaMoon size={15} />}
          </Button>
          
          {/* Dropdown Profile */}
          <Dropdown align="end">
            <Dropdown.Toggle variant="transparent" id="dropdown-profile" className={`${darkMode ? "text-light" : "text-dark"} mx-2`}>
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
