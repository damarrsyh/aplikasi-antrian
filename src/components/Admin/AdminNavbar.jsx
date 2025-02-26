import { Navbar, Container } from "react-bootstrap";

const AdminNavbar = () => {
  return (
    <Navbar bg="light" variant="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/admin">Admin Dashboard</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;