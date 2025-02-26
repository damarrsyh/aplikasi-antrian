import { Container } from "react-bootstrap";

const AdminFooter = () => {
  return (
    <footer className="bg-dark text-center text-light py-3 mt-auto">
      <Container>
        <p className="mb-0">&copy; {new Date().getFullYear()} Admin Dashboard</p>
      </Container>
    </footer>
  );
};

export default AdminFooter;