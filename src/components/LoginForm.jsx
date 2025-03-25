import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/queueNewApi";
import { Form, Button, Container, Alert, Card } from "react-bootstrap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");

      try {
        await dispatch(loginUser(email, password));
        navigate("/dashboard/queue-list");
      } catch (err) {
        setError(err.message);
      }
  }; 

  return (
  <Container className="d-flex justify-content-center align-items-center min-vh-100">
    <Card style={{ width: "350px" }} className="p-4 shadow-sm">
      <Card.Body>
        <h2 className="text-center mb-3">Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>
      </Card.Body>
    </Card>
  </Container>
  );
};

export default Login;
