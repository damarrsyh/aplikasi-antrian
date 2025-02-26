import { Navbar, Container } from "react-bootstrap";

const AdminNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/admin">Admin Dashboard</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;