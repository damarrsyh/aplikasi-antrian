import { useEffect, useState, useRef } from "react";
import { createQueueTicket, fetchQueueList, fetchServicesThunk } from "../../redux/Slice/queueSlice";
import { useDispatch, useSelector } from "react-redux";
import { Container, Card, Row, Col, Form, Button, Carousel, Modal } from "react-bootstrap";
import { FaPrint, FaPalette, FaFileAlt, FaUndo, FaTruck, FaUser } from 'react-icons/fa';
import { v4 as uuidv4 } from "uuid";

const iconMap = {
  P: <FaPrint size={30} />,
  D: <FaPalette size={30} />,
  F: <FaFileAlt size={30} />,
  R: <FaUndo size={30} />,
  O: <FaTruck size={30} />,
  T: <FaUser size={30} />,
};

const ServiceSelection = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.queue.status);
  // eslint-disable-next-line no-unused-vars
  const {qeueuList} = useSelector((state) => state.queue);
  const services = useSelector((state) => state.queue.services);
  const servicesStatus = useSelector((state) => state.queue.servicesStatus);
  const [selectedService, setSelectedService] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [ticket, setTicket] = useState(null);
  const [enableForm, setEnableForm] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showTicketModal, setShowTicketModal] = useState(false);
  const ticketRef = useRef(null);

useEffect(() => {
  if (status === "idle") {
    dispatch(fetchQueueList());
    dispatch(fetchServicesThunk());
  }
}, [status, dispatch]);

  const handleServiceSelect = async (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    if (servicesStatus[serviceId]) {
      setSelectedService(service);
    }
  };

  const generateTicket = async (service) => {
    if (service) {
      const queuePrefix = service.kode; // Gunakan kode dari API
      const queueNumber = `${queuePrefix}${Math.floor(10 + Math.random() * 99)}`;
      const queueId = uuidv4();
      const customerId = uuidv4();

      const newTicket = {
        id: queueId,
        customer: {
          id: customerId,
          customer_name: enableForm ? name : `Customer/${service.id}`,
          phone: enableForm ? phone : "-",
          queue_number: queueNumber,
        },
        service: {
          id: service.id,
          service_name: service.nama, // Gunakan 'nama' dari API
        },
        status: "Waiting",
        created_at: new Date().toISOString(),
        time_start: null,
        time_end: null,
      };

      try {
        const result = await dispatch(createQueueTicket(newTicket)).unwrap();
        if (result) {
          setTicket(result);
          setShowTicketModal(true);
        }
      } catch (error) {
        console.error("Error saat membuat tiket:", error);
        setErrorMessage(error || "Terjadi kesalahan saat membuat tiket");
        setShowErrorModal(true);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateTicket(selectedService);
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
              {services.map(service => {
                const isActive = servicesStatus[service.id] ?? true;
                
                return (
                  <Col key={service.id} md={6} className="my-2">
                    <Card
                      className={`h-100 shadow-sm rounded-3 service-card border position-relative ${
                        selectedService?.id === service.id ? "border-primary text-primary bg-primary-subtle" : "border-secondary bg-light text-dark"
                      }`}
                      onClick={() => handleServiceSelect(service.id)}
                      style={{
                        filter: isActive ? "none" : "blur(3px)", // Blur jika nonaktif
                        pointerEvents: isActive ? "auto" : "none" // Disable klik jika nonaktif
                      }}
                    >
                      <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                        <div className={`p-4 rounded border ${selectedService?.id === service.id ? "border-primary text-primary bg-light" : "border-secondary text-dark"}`}>
                          {iconMap[service.kode] || <FaUser size={30} />}
                        </div>
                        <Card.Text className={`py-1 px-4 fw-semibold my-2 rounded-4 ${selectedService?.id === service.id ? "bg-info text-dark border border-primary" : "bg-light text-dark border border-secondary"}`}>
                          {service.nama}
                        </Card.Text>
                      </Card.Body>
                      
                      {/* Overlay jika layanan nonaktif */}
                      {!isActive && (
                        <>
                          <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 d-flex align-items-center justify-content-center text-center bg-dark bg-opacity-50 rounded-3">
                            <span className="text-white fw-bold">Layanan Sedang Off</span>
                          </div>
                        </>
                      )}
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Col>
          <Col md={6} className="d-flex flex-column mt-2">
            <Card className={`flex-grow-1 shadow-sm rounded ${enableForm ? "border-primary" : "border-secondary border"}`}>
              <Card.Header className={`d-flex align-items-center ${enableForm ? "bg-primary" : ""}`}>
                  <Form.Check
                    type="checkbox"
                    onChange={() => setEnableForm(!enableForm)}
                    style={{ transform: "scale(2)" }}
                    className="mx-2 me-3"
                  />
                  <h4 className={`mb-0 ${enableForm ? "text-white" : "text-muted"}`}>Option</h4>
              </Card.Header>
              <Card.Body className="d-flex flex-column">
                <Form onSubmit={handleSubmit} className="flex-grow-1">
                  <Form.Group className="mb-3 mt-3" controlId="formName">
                    <Form.Label className={enableForm ? "text-dark" : "text-muted"}>Nama</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={enableForm ? "Enter your name" : ""}
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
                      placeholder={enableForm ? "Enter your phone number" : ""}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!enableForm}
                      className={enableForm ? "text-dark" : "text-muted"}
                    />
                  </Form.Group>
                  <Button variant={enableForm ? "primary" : "outline-muted"} type="submit" disabled={!enableForm}>
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
          <Modal.Body ref={ticketRef} className="d-flex align-items-center justify-content-center">
            <Card className="p-4 text-center rounded border border-dark shadow" style={{ maxWidth: "400px", width: "100%" }}>
              <Card.Body>
                {/* Header Lokasi */}
                <Card.Title className="fw-bold text-uppercase fs-5">
                  Pandawa24Jam <br />
                  Margonda, Depok
                </Card.Title>
                <hr />

                {/* Tanggal dan Waktu */}
                <div className="d-flex justify-content-between">
                  <span>{new Date().toLocaleDateString()}</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>

                {/* Nomor Antrian Besar */}
                <Card.Text className="fw-bold text-uppercase fs-1 bg-light p-3 rounded border border-dark">
                  {ticket?.customer?.queue_number}
                </Card.Text>

                {/* Loket atau Jenis Layanan */}
                <Card.Text className="fw-bold fs-5">
                  ANTRIAN {ticket?.service?.service_name?.toUpperCase()}
                </Card.Text>

                <hr />

                {/* Informasi Tambahan */}
                <Card.Text className="text-muted">
                </Card.Text>
                <Card.Text className="text-muted">
                  Cs: +62 899 414 9569
                </Card.Text>
              </Card.Body>
            </Card>
          </Modal.Body>
          
          <Modal.Footer>
            <Button variant="primary" onClick={handlePrint}>Cetak Tiket</Button>
          </Modal.Footer>
        </Modal>
        {/* End Modal Tiket Antrian */}

      {/* Modal Error */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Gagal Membuat Tiket</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>Tutup</Button>
        </Modal.Footer>
      </Modal>
      {/* ENd Modal Error */}
    </Container>
  );
};

export default ServiceSelection;
