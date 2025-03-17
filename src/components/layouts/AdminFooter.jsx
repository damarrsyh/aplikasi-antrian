import { Container } from "react-bootstrap";

const AdminFooter = () => {
  return (
    <footer className="text-center py-2 mt-auto shadow-sm">
      <Container>
        <p className="mb-0">&copy; {new Date().getFullYear()} Admin Dashboard</p>
      </Container>
    </footer>
  );
};

export default AdminFooter;
