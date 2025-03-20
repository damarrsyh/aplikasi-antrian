import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Container, Card, Spinner } from "react-bootstrap";
import { login } from "../api/queueApi";
import { loginSuccess } from "../redux/Slice/authSlice";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loket, setLoket] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loketList, setLoketList] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setLoketList(["Loket 1", "Loket 2", "Loket 3"]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password || !loket) {
      setError("Semua field harus diisi!");
      setLoading(false);
      return;
    }

    try {
      const user = await login(email, password, loket);
      dispatch(loginSuccess({ user, token: "dummy-token" })); // Simpan di Redux
      navigate("/dashboard/queue-list");
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid
      className="d-flex justify-content-center align-items-center vh-100 animated-bg"
    >
          <Card className="custom-card-login rounded">
      <Card.Title className="text-center mb-3 text-white">Sign In</Card.Title>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="text-white">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="custom-input"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="text-white">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="custom-input"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="text-white">Pilih Loket</Form.Label>
          <Form.Select
            value={loket}
            onChange={(e) => setLoket(e.target.value)}
            className="custom-select"
          >
            <option value="">-- Pilih Loket --</option>
            {loketList.map((loket, index) => (
              <option key={index} value={loket}>{loket}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button variant="light" type="submit" className="w-100 custom-button" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Sign In"}
        </Button>
      </Form>
    </Card>
    </Container>
  );
};

export default LoginForm;
