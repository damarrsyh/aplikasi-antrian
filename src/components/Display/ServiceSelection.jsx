import { Container, Card, Button, Row, Col, Form, Carousel } from 'react-bootstrap';
import { useState } from 'react';
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

  const handleServiceSelect = (serviceId) => {
    setSelectedService(services.find(service => service.id === serviceId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedService) {
      const queueNumber = `${selectedService.id}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTicket = {
        number: queueNumber,
        serviceId: selectedService.id,
        service: selectedService.name,
        name: enableForm ? name : "-",
        phone: enableForm ? phone : "-",
      };
      setTicket(newTicket);
      setTimeout(() => window.print(), 500);
    }
  };

  return (
    <Container>
      {!ticket ? (
        <Row className="vh-100">
          <Col md={6} className="d-flex flex-column">
            <h3 className="my-4">Pilih Layanan</h3>
            <Row className="flex-grow-1">
              {services.map(service => {
                const isSelected = selectedService?.id === service.id;
                return (
                  <Col key={service.id} md={6} className="mb-3">
                    <Card
                      className={`h-100 ${isSelected ? "bg-primary text-white border-primary shadow-sm" : "bg-light"}`}
                      onClick={() => {
                        handleServiceSelect(service.id);
                        if (!enableForm) {
                          handleSubmit(new Event("submit"));
                        }
                      }}
                    >
                      <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                        {service.icon}
                        <Card.Text className="text-center mt-5">
                          <h5>{service.name}</h5>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Col>
          <Col md={6} className="d-flex flex-column">
            <div className="d-flex align-items-center my-4">
              <h3 className="mb-0 me-3">Data Diri</h3>
              <Form.Check
                type="checkbox"
                onChange={() => setEnableForm(!enableForm)}
                style={{ transform: "scale(1.5)" }}
              />
              <p className="my-2 text-muted" style={{ transform: "scale(0.9)" }}>
                Beri tanda centang untuk mengisi form
              </p>
            </div>
            <Card className={`flex-grow-1 ${enableForm ? "" : "bg-secondary bg-opacity-10"}`}>
              <Card.Body className="d-flex flex-column">
                <Form onSubmit={handleSubmit} className="flex-grow-1 d-flex flex-column">
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label className={enableForm ? "" : "text-muted"}>Nama</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="@example: pandawa"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!enableForm}
                      className={`border ${enableForm ? "border-primary" : "border-secondary"} ${enableForm ? "" : "bg-light text-secondary"}`}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formPhone">
                    <Form.Label className={enableForm ? "" : "text-muted"}>No Telepon</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="@example: 08xxxxxxxxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!enableForm}
                      className={`border ${enableForm ? "border-primary" : "border-secondary"} ${enableForm ? "" : "bg-light text-secondary"}`}
                    />
                  </Form.Group>
                  <Button variant={enableForm ? "primary" : "secondary"} type="submit" disabled={!enableForm}>
                    Submit
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            <div className="d-flex flex-grow-1 my-3 align-items-center justify-content-center">
              <Carousel>
                <Carousel.Item interval={3000}>
                  <img className="d-block w-100" src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop" alt="First slide" height={400} />
                  <Carousel.Caption>
                    <h3>First Slide Label</h3>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={3000}>
                  <img className="d-block w-100" src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop" alt="Second slide" height={400} />
                  <Carousel.Caption>
                    <h3>Second Slide Label</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={3000}>
                  <img className="d-block w-100" src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop" alt="Third slide" height={400} />
                  <Carousel.Caption>
                    <h3>Third Slide Label</h3>
                    <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </div>
          </Col>
        </Row>
      ) : (
        <Container className="d-flex justify-content-center align-items-center vh-100">
          <Card className="p-4 text-center" style={{ maxWidth: "400px", width: "100%" }}>
            <Card.Body>
              <Card.Title className="fw-bold fs-3">Tiket Antrian</Card.Title>
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
