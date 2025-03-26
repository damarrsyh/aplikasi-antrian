import { useState, useCallback, useMemo } from "react";
import { createQueueTicket } from "../../api/queueNewApi";
import { Form, Card, Row, Col, Carousel, Modal } from "react-bootstrap";

const QueueServiceMenu = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [queueNumber, setQueueNumber] = useState("");

  const isValidPhoneNumber = (phone) => /^[0-9]{10,13}$/.test(phone);

  // Data queue type & carousel di-memo agar tidak dibuat ulang
  const queueTypes = useMemo(() => [
    { id: "siap_print", label: "Print", icon: "/assets/icons/print.png" },
    { id: "design", label: "Design", icon: "/assets/icons/design.png" },
    { id: "fotocopy", label: "Fotocopy", icon: "/assets/icons/fc.png" },
    { id: "retur", label: "Retur Barang", icon: "/assets/icons/retur.webp" },
    { id: "pick", label: "Online Pick Up", icon: "/assets/icons/pick.png" },
    { id: "tamu", label: "Tamu / Supplier", icon: "/assets/icons/tamu.webp" },
  ], []);

  const carouselImages = useMemo(() => ["c1.png", "c2.jpg", "c3.jpg"], []);

  const handleSelectService = useCallback(async (selectedType) => {
    setType(selectedType);
    try {
      const response = await createQueueTicket(selectedType, name || "Guest", phone || "-");
      console.log("Tiket berhasil dibuat:", response);

      setQueueNumber(response.nomor);
      setShowModal(true);

      // Tutup modal otomatis setelah 3 detik
      setTimeout(() => setShowModal(false), 3000);

      // Reset form
      setName("");
      setPhone("");
      setType("");
    } catch (error) {
      console.error("Gagal membuat tiket:", error);
      alert("Gagal membuat tiket. Silakan coba lagi.");
    }
  }, [name, phone]);

  // Handle Submit Form (Prevent Default)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (type) {
      handleSelectService(type);
    }
  };

  return (
    <Row className="vh-100">
      {/* Bagian Kiri: Form */}

      <Col md={6} className="d-flex flex-column mt-2">
        <Card className="flex-grow-1 shadow-sm rounded">
          <Card.Header className="bg-primary-subtle text-primary">
            <span className="fw-bold fs-6 mb-0">Form Customer (Opsional)</span>
          </Card.Header>
          <Card.Body className="d-flex flex-column gap-3">
            <Form onSubmit={handleSubmit} className="flex-grow-1">
              <Form.Group className="mb-3">
                <Form.Label>Nama :</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Your Name"
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>No. Telepon :</Form.Label>
                <Form.Control
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  isInvalid={phone && !isValidPhoneNumber(phone)}
                  placeholder="Enter Your Phone Number"
                />
                <Form.Control.Feedback type="invalid">
                  Nomor Harus Berjumlah 10-13 Digit
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>

        {/* Carousel */}
        <Carousel className="d-flex my-2 align-items-center justify-content-center">
          {carouselImages.map((image, index) => (
            <Carousel.Item key={index} interval={3000} className="rounded">
              <img
                className="img-fluid rounded"
                src={`/${image}`}
                alt={`Slide ${index + 1}`}
                loading="lazy"
                onError={(e) => (e.target.src = "/fallback.jpg")}
                style={{ objectFit: "cover", maxHeight: "400px", width: "100%" }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </Col>


      {/* Bagian Kanan: Pilih Layanan */}
      <Col md={6} className="d-flex flex-column">
        <Row className="flex-grow-1">
          {queueTypes.map((item) => (
            <Col key={item.id} md={6} className="my-2">
              <Card
                className={`h-100 shadow rounded-3 service-card position-relative ${type === item.id ? "bg-primary-subtle" : ""}`}
                onClick={() => handleSelectService(item.id)}
                style={{ cursor: "pointer" }}
              >
                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                  <div className="p-3 rounded shadow">
                    <img src={item.icon} alt={item.label} width={70} height={70} />
                  </div>
                  <Card.Text className={`fs-6 py-2 px-4 fw-semibold my-3 rounded-4 shadow ${type === item.id ? "text-primary" : ""}`}>
                    {item.label}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Col>

      {/* MODAL TIKET */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tiket Berhasil Dibuat</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h4>Nomor Antrian Anda:</h4>
          <h2 className="fw-bold text-primary">{queueNumber}</h2>
        </Modal.Body>
      </Modal>
    </Row>
  );
};

export default QueueServiceMenu;
