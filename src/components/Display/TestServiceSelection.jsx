import { useEffect, useState } from "react";
import { getProcessedQueues, createTicket } from "../Admin/TestQueueActions";
import { Container, Card, Row, Col, Form, Button, Carousel, Modal } from "react-bootstrap";
import { FaPrint, FaPalette, FaFileAlt, FaUndo, FaTruck, FaUser } from 'react-icons/fa';
import { v4 as uuidv4 } from "uuid";

const services = [
  { id: "J0001", name: "Siap Print", icon: <FaPrint size={50} /> },
  { id: "J0002", name: "Design", icon: <FaPalette size={50} /> },
  { id: "J0003", name: "FotoCopy", icon: <FaFileAlt size={50} /> },
  { id: "J0004", name: "Retur Penjualan", icon: <FaUndo size={50} /> },
  { id: "J0005", name: "Online Pickup", icon: <FaTruck size={50} /> },
  { id: "J0006", name: "Tamu", icon: <FaUser size={50} /> }
];

const ServiceSelection = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [ticket, setTicket] = useState(null);
  const [enableForm, setEnableForm] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [queues, setQueues] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  

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
      const queueNumber = `A${Math.floor(1 + Math.random() * 99)}`; // Format nomor antrian
      const queueId = uuidv4(); // ID antrian unik
      const customerId = uuidv4(); // ID customer unik
  
      const newTicket = {
        queue_id: queueId,
        customer: {
          id: customerId,
          name: enableForm ? name : `Customer/${selectedService.id}`,
          phone: enableForm ? phone : "-",
          queue_number: queueNumber,
        },
        service: {
          id: selectedService.id,
          name: selectedService.name,
        },
        status: "Waiting",
        created_at: new Date().toISOString(),
        time_start: null,
        time_end: null,
      };
  
      console.log("Data yang dikirim ke API:", newTicket);
  
      try {
        const response = await createTicket(newTicket);
        console.log("Response dari API:", response);
        if (response) {
          setTicket(response);
          setSelectedService(null); // Reset setelah berhasil
        } else {
          throw new Error("Response dari API kosong atau tidak valid");
        }
      } catch (error) {
        console.error("Error saat membuat tiket:", error);
        setErrorMessage(error.message || "Terjadi kesalahan saat membuat tiket.");
        setShowErrorModal(true);
        setTimeout(() => setShowErrorModal(false), 3000);
      }
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    generateTicket();
  };

  return (
    <Container fluid style={{backgroundColor: "#E3F2FD"}}>
      {!ticket ? (
        <Row className="vh-100">
          <Col md={6} className="d-flex flex-column">
            <Row className="flex-grow-1">
              {services.map(service => (
                <Col key={service.id} md={6} className="my-2">
                  <Card
                    className="h-100 shadow rounded-3 bg-light"
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    <Card.Body className="d-flex flex-column justify-content-center align-items-center text-primary">
                      {service.icon}
                      <Card.Text className="h5 text-dark my-4">
                          {service.name}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
          <Col md={6} className="d-flex flex-column mt-2">
          <Card className={`flex-grow-1 shadow rounded-3 ${enableForm ? "bg-light" : "bg-transparent"}`}>
            <Card.Body className="d-flex flex-column">
              <div className="d-flex align-items-center ">
                <h3 className={`mb-0 me-3 text-uppercase ${enableForm ? "text-dark" : "text-muted"}`}>Data Diri</h3>
                <Form.Check
                  type="checkbox"
                  onChange={() => setEnableForm(!enableForm)}
                  style={{ transform: "scale(1.5)" }}
                />
                <p className={`my-2 ${enableForm ? "text-dark" : "text-muted"}`} style={{ transform: "scale(0.9)" }}>
                  Beri tanda centang untuk mengisi form
                </p>
              </div>
              <Form onSubmit={handleSubmit} className="flex-grow-1">
                <Form.Group className="mb-3 mt-3" controlId="formName">
                  <Form.Label className={enableForm ? "text-dark" : "text-muted"}>Nama</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="@example: pandawa"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!enableForm}
                    className={enableForm ? "bg-light text-dark" : "bg-transparent text-muted"}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPhone">
                  <Form.Label className={enableForm ? "text-dark" : "text-muted"}>No Telepon</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="@example: 08xxxxxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!enableForm}
                    className={enableForm ? "bg-light text-dark" : "bg-transparent text-muted"}
                  />
                </Form.Group>
                <Button variant={enableForm ? "primary" : "text-muted"} type="submit" disabled={!enableForm}>
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
            <div className="d-flex my-2 align-items-center justify-content-center">
              <Carousel>
                {["c1.png", "c2.jpg", "c3.jpg"].map((image, index) => (
                  <Carousel.Item key={index} interval={3000} className='rounded'>
                    <img className="img-fluid rounded" src={`/${image}`} alt={`Slide ${index + 1}`}/>
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
              <Card.Text className="fw-bold text-uppercase fs-2 bg-light p-3 rounded">{ticket.customer?.queue_number}</Card.Text>
              <Card.Text><strong>Layanan :</strong> {ticket.service?.name}</Card.Text>
              <Card.Text><strong>Nama :</strong> {ticket.customer?.name}</Card.Text>
              <Card.Text><strong>No Telepon :</strong> {ticket.customer?.phone}</Card.Text>
              <Button variant="success" onClick={() => window.print()}>Cetak Tiket</Button>
            </Card.Body>
          </Card>
        </Container>
      )}
      {/* Modal untuk menampilkan error */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Gagal Membuat Tiket</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>Tutup</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ServiceSelection;
