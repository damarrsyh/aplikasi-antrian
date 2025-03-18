import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQueueList, fetchServicesThunk, fetchCountryCodesThunk, createQueueTicket } from "../../redux/Slice/queueSlice";
import { v4 as uuidv4 } from "uuid";
import ServiceSelection from "../../components/Service/ServiceSelection";
import CustomerForm from "../../components/Service/CustomerForm";
import ServiceCarousel from "../../components/Service/ServiceCarousel";
import { Container, Row, Col, Modal, Button, Card } from "react-bootstrap";

const QueueMenuPage = () => {
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

  const handleServiceSelect = async (serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    if (service && (servicesStatus[serviceId] ?? true)) {
      setSelectedService(service);
      if (!enableForm) {
        generateTicket(service);
      }
    }
  };

  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{8,13}$/; // Hanya angka dengan panjang 10-13 digit
    return phoneRegex.test(phone);
  };

  const generateTicket = async (service) => {
    if (service) {
      if (enableForm && !isValidPhoneNumber(phone)) {
        setErrorMessage("Nomor HP tidak valid! Harap isi dengan angka 10-13 digit.");
        setShowErrorModal(true);
        return;
      }

      const queueNumber = `${service.kode}${Math.floor(10 + Math.random() * 99)}`;
      const fullPhoneNumber = enableForm ? `${countryCode.replace("+", "")}${phone.trim()}` : "-";

      const newTicket = {
        id: uuidv4(),
        customer: {
          id: uuidv4(),
          customer_name: enableForm ? name.trim() || "Anonim" : `Customer/${service.id}`,
          phone: fullPhoneNumber,
          queue_number: queueNumber,
        },
        service: {
          id: service.id,
          service_name: service.nama,
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
          <ServiceSelection services={services} servicesStatus={servicesStatus} selectedService={selectedService} handleServiceSelect={handleServiceSelect} />
        </Col>
        <Col md={6} className="d-flex flex-column mt-2">
          <CustomerForm enableForm={enableForm} setEnableForm={setEnableForm} name={name} setName={setName} phone={phone} setPhone={setPhone} countryCode={countryCode} setCountryCode={setCountryCode} countryCodes={countryCodes} handleSubmit={handleSubmit}/>
          <ServiceCarousel />
        </Col>
      </Row>

      {/* Modal Tiket */}
      <Modal show={showTicketModal} onHide={() => setShowTicketModal(false)} centered>
        <Modal.Body ref={ticketRef} className="d-flex align-items-center justify-content-center">
          <Card className="p-4 text-center rounded border border-dark shadow" style={{ maxWidth: "400px", width: "100%" }}>
            <Card.Body>
              <Card.Title className="fw-bold text-uppercase fs-5">Pandawa24Jam <br /> Margonda, Depok</Card.Title>
              <hr />
              <Card.Text className="fw-bold text-uppercase fs-1 bg-light p-3 rounded border border-dark">{ticket?.customer?.queue_number}</Card.Text>
              <Card.Text className="fw-bold fs-5">ANTRIAN {ticket?.service?.service_name?.toUpperCase()}</Card.Text>
              <hr />
              <Card.Text className="text-muted">Cs: +62 899 414 9569</Card.Text>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handlePrint}>Cetak Tiket</Button>
        </Modal.Footer>
      </Modal>
      {/* End Modal Tiket */}

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

export default QueueMenuPage;
