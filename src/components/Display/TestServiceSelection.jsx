import { useEffect, useState, useRef } from "react";
import { getProcessedQueues, createTicket } from "../Admin/TestQueueActions";
import { Container, Card, Row, Col, Form, Button, Carousel, Modal } from "react-bootstrap";
import { FaPrint, FaPalette, FaFileAlt, FaUndo, FaTruck, FaUser } from 'react-icons/fa';
import { v4 as uuidv4 } from "uuid";

const services = [
  { id: "J0001", name: "Siap Print", icon: <FaPrint size={30} /> },
  { id: "J0002", name: "Design", icon: <FaPalette size={30} /> },
  { id: "J0003", name: "FotoCopy", icon: <FaFileAlt size={30} /> },
  { id: "J0004", name: "Retur Penjualan", icon: <FaUndo size={30} /> },
  { id: "J0005", name: "Online Pickup", icon: <FaTruck size={30} /> },
  { id: "J0006", name: "Tamu", icon: <FaUser size={30} /> }
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
  const [showTicketModal, setShowTicketModal] = useState(false);
  const ticketRef = useRef(null);

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
      const queueNumber = `A${Math.floor(10 + Math.random() * 99)}`;
      const queueId = uuidv4();
      const customerId = uuidv4();

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

      try {
        const response = await createTicket(newTicket);
        if (response) {
          setTicket(response);
          setShowTicketModal(true); // Tampilkan modal tiket setelah tiket dibuat
        } else {
          throw new Error("Response dari API kosong atau tidak valid");
        }
      } catch (error) {
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

  const handlePrint = () => {
    if (ticketRef.current) {
      const printContent = ticketRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  return (
    <Container fluid>
        <Row className="vh-100">
          <Col md={6} className="d-flex flex-column">
            <Row className="flex-grow-1">
              {services.map(service => (
                <Col key={service.id} md={6} className="my-2">
                  <Card
                    className={`h-100 shadow-sm rounded-3 service-card border border-primary text-primary ${
                      selectedService === service.id ? "selected" : "bg-light"
                    }`}
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    <Card.Body className="d-flex flex-column justify-content-center align-items-center text-primary">
                      <div className="bg-primary-subtle p-4 rounded border border-primary text-primary">
                        {service.icon}
                      </div>
                      <Card.Text className="bg-info-subtle py-1 px-4 fw-semibold my-2 rounded-4 text-primary border border-info">
                        {service.name}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
          <Col md={6} className="d-flex flex-column mt-2">
          <Card className={`flex-grow-1 shadow-sm rounded ${enableForm ? "border-primary" : "bg-transparent border"}`}>
            <Card.Body className="d-flex flex-column">
              <div className="d-flex align-items-center ">
                <Form.Check
                  type="checkbox"
                  onChange={() => setEnableForm(!enableForm)}
                  style={{ transform: "scale(2)" }}
                  className="mx-2 me-3"
                />
                <h4 className={`mb-0 ${enableForm ? "text-dark" : "text-muted"}`}>Option</h4>
              </div>
              <Form onSubmit={handleSubmit} className="flex-grow-1">
                <Form.Group className="mb-3 mt-3" controlId="formName">
                  <Form.Label className={enableForm ? "text-dark" : "text-muted"}>Nama</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={enableForm ? "@example: pandawa" : ""}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!enableForm}
                    className={enableForm ? "text-dark" : "text-muted"}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPhone">
                  <Form.Label className={enableForm ? "text-dark" : "text-muted"}>No Telepon</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={enableForm ? "@example: 08xxxxxxxxxxx" : ""}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!enableForm}
                    className={enableForm ? "text-dark" : "text-muted"}
                  />
                </Form.Group>
                <Button variant={enableForm ? "primary" : "outline-primary"} type="submit" disabled={!enableForm}>
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <Carousel className="d-flex my-2 align-items-center justify-content-centers">
            {["c1.png", "c2.jpg", "c3.jpg"].map((image, index) => (
              <Carousel.Item key={index} interval={3000} className='rounded border-success'>
                <img className="img-fluid rounded" src={`/${image}`} alt={`Slide ${index + 1}`}/>
              </Carousel.Item>
            ))}
          </Carousel>
          </Col>
        </Row>
        {/* Modal Tiket Antrian */}
        <Modal show={showTicketModal} onHide={() => setShowTicketModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tiket Antrian</Modal.Title>
        </Modal.Header>
        <Modal.Body ref={ticketRef} className="d-flex align-items-center justify-content-center">
          <Card className="p-4 text-center rounded" style={{ maxWidth: "400px", width: "100%" }}>
            <Card.Body>
              <Card.Title className="fw-bold fs-3 text-uppercase">Tiket Antrian</Card.Title>
              <hr />
              <Card.Text className="fw-bold text-uppercase fs-2 bg-light p-3 rounded">{ticket?.customer?.queue_number}</Card.Text>
              <Card.Text><strong>Layanan :</strong> {ticket?.service?.name}</Card.Text>
              <Card.Text><strong>Nama :</strong> {ticket?.customer?.name}</Card.Text>
              <Card.Text><strong>No Telepon :</strong> {ticket?.customer?.phone}</Card.Text>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handlePrint}>Cetak Tiket</Button>
        </Modal.Footer>
      </Modal>
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
