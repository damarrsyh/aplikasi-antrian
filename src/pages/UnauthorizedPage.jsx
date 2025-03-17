import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Card } from "react-bootstrap";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5); // Waktu hitung mundur sebelum redirect

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Redirect setelah waktu habis
    if (countdown === 0) {
      navigate("/login");
    }

    return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 text-center shadow-lg" style={{ maxWidth: "400px", animation: "fadeIn 1s ease-in-out" }}>
        <h2 className="text-danger">🚫 Akses Ditolak!</h2>
        <p className="mt-3">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        <p className="text-muted">Mengalihkan ke halaman login dalam {countdown} detik...</p>
        <Button variant="primary" onClick={() => navigate("/login")}>Kembali ke Beranda</Button>
      </Card>

      {/* Animasi CSS */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Container>
  );
};

export default UnauthorizedPage;
