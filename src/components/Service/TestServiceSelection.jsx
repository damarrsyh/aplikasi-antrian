import { useEffect, useState, useRef } from "react";
import { createQueueTicket, fetchQueueList, fetchServicesThunk, fetchCountryCodesThunk } from "../../redux/Slice/queueSlice";
import { useDispatch, useSelector } from "react-redux";
import { Container, Card, Row, Col, Form, Button, Carousel, Modal } from "react-bootstrap";
import { FaPrint, FaPalette, FaFileAlt, FaUndo, FaTruck, FaUser } from 'react-icons/fa';
import { v4 as uuidv4 } from "uuid";
import Select from "react-select";

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
  const services = useSelector((state) => state.queue.services);
  const servicesStatus = useSelector((state) => state.queue.servicesStatus);
  const countryCodes = useSelector((state) => state.queue.countryCodes);

  const [selectedService, setSelectedService] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+62");
  const [ticket, setTicket] = useState(null);
  const [enableForm, setEnableForm] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showTicketModal, setShowTicketModal] = useState(false);
  const ticketRef = useRef(null);

useEffect(() => {
    dispatch(fetchQueueList());
    dispatch(fetchServicesThunk());
    dispatch(fetchCountryCodesThunk());

}, [dispatch]);

const customStyles = {
  control: (provided) => ({
    ...provided,
    minWidth: "120px",
    borderRadius: "5px",
    fontSize: "14px",
  }),
  option: (provided) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
  }),
  singleValue: (provided) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
  }),
};

  const handleServiceSelect = async (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    if (service && (servicesStatus[serviceId]?? true)) {
      setSelectedService(service);

      if(!enableForm) { 
        generateTicket(service);
      }
    }
  };

  const generateTicket = async (service) => {
    if (service) {
      const queueNumber = `${service.kode}${Math.floor(10 + Math.random() * 99)}`;
      const fullPhoneNumber = enableForm ? `${countryCode.replace("+", "")}${phone.trim()}` : "-";

      const newTicket = {
        id: uuidv4(),
        customer: {
          id: uuidv4(),
          customer_name: enableForm ? name.trim || "Anonim" : `Customer/${service.id}`,
          phone: fullPhoneNumber,
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
    if (enableForm && selectedService) {
      generateTicket(selectedService);
    }
  };

  const handlePrint = () => {
    if (ticketRef.current) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Cetak Tiket</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
            <style>
              body { font-family: Poppins, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; }
              .ticket-container { max-width: 400px; width: 100%; padding: 20px; }
            </style>
          </head>
          <body>
            <div class="ticket-container">
              ${ticketRef.current.innerHTML}
            </div>
            <script>
              window.onload = function() {
              window.print();
              setTimeout(() => {
                window.close();
                window.opener.location.reload(); // Refresh halaman setelah cetak selesai
              }, 500);
            };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
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
                    >
                      <Card.Body 
                      className="d-flex flex-column justify-content-center align-items-center"                       
                      style={{
                        filter: isActive ? "none" : "blur(1.5px)", // Blur jika nonaktif
                        pointerEvents: isActive ? "auto" : "none" // Disable klik jika nonaktif
                      }}>
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
                            <h3 className="text-danger fw-bold">Layanan <br/> Sedang Off</h3>
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
                {enableForm && (
                  <>
                    <Form.Group className="mt-3">
                      <Form.Label>Nama</Form.Label>
                      <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mt-3">
                      <Form.Label>No Telepon</Form.Label>
                      <div className="d-flex">
                        {/* Dropdown dengan react-select */}
                        <Select
                          value={countryCodes.find((c) => c.code === countryCode)}
                          onChange={(selected) => setCountryCode(selected.code)}
                          options={countryCodes}
                          getOptionLabel={(e) => (
                            <div style={{ display: "flex", alignItems: "center" }}>
                              {e.code}
                            </div>
                          )}
                          getOptionValue={(e) => e.code}
                          styles={customStyles}
                          isDisabled={!enableForm}
                        />
                        
                        {/* Input nomor telepon */}
                        <Form.Control
                          type="text"
                          placeholder="Enter phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          disabled={!enableForm}
                          className="ms-2"
                          style={{ flex: 1 }}
                        />
                      </div>
                    </Form.Group>
                    <Button className="mt-3" variant={enableForm ? "primary" : "outline-muted"} type="submit" disabled={!enableForm}>
                      Submit
                    </Button>
                  </>
                )}
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
