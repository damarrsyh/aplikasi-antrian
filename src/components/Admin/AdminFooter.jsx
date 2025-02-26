import { Container } from "react-bootstrap";

const AdminFooter = () => {
  return (
    <footer className="bg-light text-center py-3 mt-auto shadow-sm" style={{ borderTop: "1px solid #D3D3D3" }}>
      <Container>
        <p className="mb-0">&copy; {new Date().getFullYear()} Admin Dashboard</p>
      </Container>
    </footer>
  );
};

export default AdminFooter;
