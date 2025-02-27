import { useEffect, useState } from "react";
import { getProcessedQueues, createTicket } from "../Admin/TestQueueActions";
import { Container, Card, Row, Col, Form, Button, Carousel } from "react-bootstrap";
import { FaPrint, FaPalette, FaFileAlt, FaUndo, FaTruck, FaUser } from 'react-icons/fa';

const services = [
  { id: "j0001", name: "Siap Print", icon: <FaPrint size={50} /> },
  { id: "j0002", name: "Design/Edit/Kreatif", icon: <FaPalette size={50} /> },
  { id: "j0003", name: "FotoCopy/Jilid/Scan", icon: <FaFileAlt size={50} /> },
  { id: "j0004", name: "Retur Penjualan", icon: <FaUndo size={50} /> },
  { id: "j0005", name: "Online Pickup", icon: <FaTruck size={50} /> },
  { id: "j0006", name: "Tamu", icon: <FaUser size={50} /> }
];

const ServiceSelection = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [ticket, setTicket] = useState(null);
  const [enableForm, setEnableForm] = useState(false);
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    if (selectedService && !enableForm) {
      generateTicket();
    }
    getProcessedQueues().then(setQueues);
  }, [selectedService]);

  const handleServiceSelect = (serviceId) => {
    setSelectedService(services.find(service => service.id === serviceId));
  };

  const generateTicket = async () => {
    if (selectedService) {
      const queueNumber = `${selectedService.id}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTicket = {
        number: queueNumber,
        serviceId: selectedService.id,
        service: selectedService.name,
        name: enableForm ? name : "-",
        phone: enableForm ? phone : "-",
      };

      try {
        const response = await createTicket(newTicket);
        setTicket(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateTicket();
  };

  return (
    <Container fluid className="bg-dark text-light">
      {!ticket ? (
        <Row className="vh-100">
          <Col md={6} className="d-flex flex-column">
            <Row className="flex-grow-1">
              {services.map(service => (
                <Col key={service.id} md={6} className="my-2">
                  <Card
                    className="h-100 shadow rounded-3 bg-secondary"
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                      {service.icon}
                      <Card.Text className="text-center mt-5">
                        {service.name}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
          <Col md={6} className="d-flex flex-column my-2">
            <Card className={`flex-grow-1 shadow rounded-3 ${enableForm ? "bg-secondary" : "bg-dark"}`}>
              <Card.Body className="d-flex flex-column">
              <div className="d-flex align-items-center ">
              <h3 className="mb-0 me-3 text-uppercase text-white">Data Diri</h3>
              <Form.Check
                type="checkbox"
                onChange={() => setEnableForm(!enableForm)}
                style={{ transform: "scale(1.5)" }}
              />
              <p className="my-2 text-white" style={{ transform: "scale(0.9)" }}>
                Beri tanda centang untuk mengisi form
              </p>
            </div>
                <Form onSubmit={handleSubmit} className="flex-grow-1">
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label className={enableForm ? "text-light" : "text-muted"}>Nama</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="@example: pandawa"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!enableForm}
                      className={enableForm ? "bg-light text-dark" : "bg-dark text-muted"}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formPhone">
                    <Form.Label className={enableForm ? "text-light" : "text-muted"}>No Telepon</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="@example: 08xxxxxxxxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!enableForm}
                      className={enableForm ? "bg-light text-dark" : "bg-dark text-muted"}
                    />
                  </Form.Group>
                  <Button variant={enableForm ? "primary" : "secondary"} type="submit" disabled={!enableForm} className="p-4">
                    Submit
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            <div className="d-flex flex-grow-1 align-items-center justify-content-center">
              <Carousel>
                {["c1.png", "c2.jpg", "c3.jpg"].map((image, index) => (
                  <Carousel.Item key={index} interval={3000} className='rounded'>
                    <img className="d-block img-fluid rounded" src={`/public/${image}`} alt={`Slide ${index + 1}`}/>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          </Col>
        </Row>
      ) : (
        <Container className="d-flex justify-content-center align-items-center vh-100">
          <Card className="p-4 text-center shadow-lg rounded-3 bg-secondary" style={{ maxWidth: "400px", width: "100%" }}>
            <Card.Body>
              <Card.Title className="fw-bold fs-3 text-uppercase">Tiket Antrian</Card.Title>
              <hr />
              <Card.Text className="fw-bold text-uppercase fs-2 bg-light p-3 rounded">{ticket.number}</Card.Text>
              <Card.Text><strong>Layanan :</strong> {ticket.service}</Card.Text>
              <Card.Text><strong>Nama :</strong> {ticket.name}</Card.Text>
              <Card.Text><strong>No Telepon :</strong> {ticket.phone}</Card.Text>
              <Button variant="success" onClick={() => window.print()}>Cetak Tiket</Button>
            </Card.Body>
          </Card>
        </Container>
      )}
    </Container>
  );
};

export default ServiceSelection;
