// Halaman Login user yang tidak sesuai

import { useNavigate } from "react-router-dom";
import { Container, Button, Card } from "react-bootstrap";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 text-center shadow" style={{ maxWidth: "400px" }}>
        <h2 className="text-danger">🚫 Akses Ditolak!</h2>
        <p className="mt-3">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        <Button variant="primary" onClick={() => navigate("/login")}>
          Kembali ke Beranda
        </Button>
      </Card>
    </Container>
  );
};

export default UnauthorizedPage;
