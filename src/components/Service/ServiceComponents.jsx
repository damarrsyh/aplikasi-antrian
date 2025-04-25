/* eslint-disable no-unused-vars */
import { useCallback, useState } from "react";
import { createQueueTicket, useSyncOfflineTickets } from "../../api/serviceApi";
import { Card, Carousel, Col, Form, Modal, Row } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";
import { queueTypes, carouselImages } from "../../utils/queueConstants";
import { saveOfflineTicket } from "../../utils/offlineTickets";
import { generateTicketHTML, printTicketAndShowModal } from "../../utils/ticketHelpers";

const ServiceComponents = () => {
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [printStatusModal, setPrintStatusModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useSyncOfflineTickets();

  const isValidPhoneNumber = (phone) => /^[0-9]{10,13}$/.test(phone);
  
  const handleSelectService = useCallback(async (selectedType) => {
    if (!selectedType) return;
  
    const nomorRandom = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    const waktuCetak = new Date().toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
    const selectedQueue = queueTypes.find((type) => type.id === selectedType);
  
    try {
      const response = await createQueueTicket(selectedType, name || "Guest", phone || "-");
      const nomorFinal = response?.data?.nomor?.toString().padStart(3, "0") || nomorRandom;
      const ticketHTML = generateTicketHTML(nomorFinal, selectedQueue, waktuCetak);
  
      await printTicketAndShowModal(ticketHTML, setPrintStatusModal);
  
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
  
      setName("");
      setPhone("");
      setType("");
  
    } catch (error) {
      saveOfflineTicket({
        type: selectedType,
        nama: name || "Guest",
        telp: phone || "-",
        nomor: nomorRandom,
      });
  
      const ticketHTML = generateTicketHTML(nomorRandom, selectedQueue, waktuCetak);
      await printTicketAndShowModal(ticketHTML, setPrintStatusModal);
    }
  }, [name, phone]);

  return (
    <Row className="vh-100">
      {/* Bagian Kiri: Form */}

      <Col md={6} className="d-flex flex-column mt-2">
        <Card className="flex-grow-1 shadow-sm rounded">
          <Card.Header className="bg-primary-subtle text-primary">
            <span className="fw-bold fs-6 mb-0">Form Customer (Opsional)</span>
          </Card.Header>
          <Card.Body className="d-flex flex-column gap-3">
            <Form className="flex-grow-1">
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
                src={`/assets/carousel/${image}`}
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
                className={`h-100 shadow rounded-3 service-card position-relative 
                  ${type === item.id ? "bg-primary-subtle" : ""}
                  ${isSubmitting ? "disabled-card" : ""}`}
                onClick={() => !isSubmitting && handleSelectService(item.id)}
                style={{
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.6 : 1,
                  pointerEvents: isSubmitting ? "none" : "auto"
                }}
              >
                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                  <div className="p-3 rounded shadow">
                    <img src={item.icon} alt={item.label} width={70} height={70} />
                  </div>
                  <Card.Text
                    className={`fs-6 py-2 px-4 fw-semibold my-3 rounded-4 shadow 
                      ${type === item.id ? "text-primary" : ""}`}
                  >
                    {isSubmitting ? "Memproses..." : item.label}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Col>

      {/* MODAL TIKET */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body className="text-center py-4">
          <div className="mb-3">
            <FaCheckCircle className="text-success" size={50} />
          </div>
          <h5 className="mb-2">Tiket Berhasil Dibuat</h5>
          <p className="text-muted mt-2 mb-0">Silakan tunggu hingga nomor Anda dipanggil</p>
        </Modal.Body>
      </Modal>

      <Modal show={printStatusModal} onHide={() => setPrintStatusModal(false)} centered>
        <Modal.Body className="text-center py-4">
          <div className="mb-3">
            <FaCheckCircle className="text-success" size={50} />
          </div>
          <h5 className="mb-2">Tiket Berhasil Dicetak</h5>
          <p className="text-muted mt-2 mb-0">Silakan tunggu hingga nomor Anda dipanggil</p>
        </Modal.Body>
      </Modal>
    </Row>
  );
};

export default ServiceComponents
