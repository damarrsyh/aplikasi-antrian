import { useState } from "react";
import { createQueueTicket } from "../../api/queueNewApi";
import { Form, Button, Card, Row, Col, Carousel } from "react-bootstrap";

const QueueServiceMenu = () => {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("siap_print");

  const isValidPhoneNumber = (phone) => /^[0-9]{10,13}$/.test(phone);

  const queueTypes = [
    { id: "siap_print", label: "Print", icon: <img src="/assets/icons/print.png" alt="" width={70} height={70}/>  },
    { id: "design", label: "Design", icon: <img src="/assets/icons/design.png" alt="" width={70} height={70}/>  },
    { id: "fotocopy", label: "Fotocopy", icon: <img src="/assets/icons/fc.png" alt="" width={70} height={70}/>  },
    { id: "retur", label: "Retur Barang", icon: <img src="/assets/icons/retur.webp" alt="" width={70} height={70}/>  },
    { id: "pick", label: "Online Pick Up", icon: <img src="/assets/icons/pick.png" alt="" width={70} height={70}/>  },
    { id: "tamu", label: "Tamu / Supplier", icon: <img src="/assets/icons/tamu.webp" alt="" width={70} height={70}/>  },
  ];

  const carouselImages = ["c1.png", "c2.jpg", "c3.jpg"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createQueueTicket(type, name, phone);
      console.log("Tiket berhasil dibuat:", response);
      alert(`Tiket berhasil dibuat! Nomor antrian: ${response.nomor}`);
    } catch (error) {
      console.error("Gagal membuat tiket:", error);
    }
  };

  return (
    <Row className="vh-100">
      {/* Bagian Kiri: Pilihan Layanan */}
      <Col md={6} className="d-flex flex-column">
        <Row className="flex-grow-1">
          {queueTypes.map((item) => (
            <Col key={item.id}  md={6} className="my-2">
              <Card
                className={`h-100 shadow rounded-3 service-card position-relative ${type === item.id ? "bg-success-subtle" : ""}`}
                onClick={() => setType(item.id)}
                style={{ cursor: "pointer" }}
              >
                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                  <div className="p-3 rounded shadow">
                    {item.icon}
                  </div>
                  <Card.Text className={`fs-6 py-2 px-4 fw-semibold my-3 rounded-4 shadow ${type === item.id ? "text-success" : ""}`}>
                      {item.label}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Col>

      {/* Bagian Kanan: Form */}
      <Col md={6} className="d-flex flex-column mt-2">
        <Card className="flex-grow-1 shadow-sm rounded">
          <Card.Header className="bg-success-subtle text-success">
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
                  required
                  placeholder="Enter Your Name"
                  className="custom-input border"
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>No. Telepon :</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    isInvalid={phone && !isValidPhoneNumber(phone)}
                    placeholder="Enter Your Phone Number"
                    className="custom-input border"
                  />
                  <Form.Control.Feedback>
                    Nomor Harus Berjumlah 8-13 Digit
                  </Form.Control.Feedback>
                </div>
              </Form.Group>

              <Button variant="success" type="submit" disabled={!type} className="mt-3">
                Cetak Tiket
              </Button>
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
    </Row>
  );
};

export default QueueServiceMenu;
