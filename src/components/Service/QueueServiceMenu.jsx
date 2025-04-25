import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createQueueTicket } from "../../api/queueNewApi";
import { getType } from "../../redux/Slice/queueNewSlice";
import { Card, Carousel, Col, Form, Modal, Row } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";

const normalizeQueueType = (rawName) => {
  const lower = rawName.toLowerCase();

  if (lower.includes("design") || lower.includes("edit") || lower.includes("kreatif")) return "design";
  if (lower.includes("fotocopy")) return "fotocopy";
  if (lower.includes("online")) return "pick";
  if (lower.includes("retur")) return "retur";
  if (lower.includes("tamu")) return "tamu";
  if (lower.includes("siap")) return "siap_print";

  return lower.replace(/\s+/g, "_"); // fallback: ubah spasi jadi underscore
};

const iconMap = {
  design: "/assets/icons/design.png",
  fotocopy: "/assets/icons/fc.png",
  pick: "/assets/icons/pick.png",
  retur: "/assets/icons/retur.webp",
  tamu: "/assets/icons/tamu.webp",
  siap_print: "/assets/icons/print.png",
};

const getIcon = (type) => iconMap[type] || "/assets/icons/default.png";

const convertImageToBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

const QueueServiceMenu = () => {
  const dispatch = useDispatch();
  const { type } = useSelector((state) => state.queueNew);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(getType());
  }, [dispatch]);

  const carouselImages = useMemo(() => ["c1.jpg", "c2.jpg", "c3.jpg"], []);
  const isValidPhoneNumber = (phone) => /^[0-9]{10,13}$/.test(phone);

  // Ambil data aktif saja dari cachedData
  const queueTypes = (type?.cachedData || [])
  .filter((item) => item.aktif === "Y")
  .map((item) => {
    const normalizedId = normalizeQueueType(item.jenis_antrian);
    return {
      id: normalizedId,
      label: item.jenis_antrian
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      icon: getIcon(normalizedId),
      kd_jenis_antrian: item.kd_jenis_antrian, // ex: "J0001"
      kd_identifikasi: item.kd_identifikasi,   // ex: "D"
    };
  }); 

  const handleSelectService = useCallback(async (selectedType) => {
    try {

      const logoBase64 = await convertImageToBase64("/logopandawa.jpg");
      console.log("🟡 Memulai pembuatan tiket...");
  
      const response = await createQueueTicket(
        selectedType,
        name.trim() || "Guest",
        phone.trim() || "-"
      );
  
      console.log("✅ Tiket berhasil dibuat dari server:", response?.data);
  
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
      setName("");
      setPhone("");
  
      const selectedQueue = queueTypes.find((type) => type.id === selectedType);
      const prefix = selectedQueue?.kd_identifikasi || "X";
      const nomor = response?.data?.nomor?.toString().padStart(3, "0") || "000";
      const waktuCetak = new Date().toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      });
  
      const ticketHTML = `
        <html>
          <head>
            <style>
              body { font-family: 'Poppins', sans-serif; text-align: center; padding: 20px; }
              .ticket-box { border: 2px dashed #000; padding: 10px 20px; width: 300px; margin: auto; }
              .queue-number { font-size: 60px; font-weight: bold; margin: 10px 0; }
              .service-info { font-size: 16px; margin: 10px 0; }
              .timestamp { font-size: 14px; margin-top: 10px; color: #555; }
              .logo { width: 100px; margin: 0 auto 10px; }
            </style>
          </head>
          <body>
            <div class="ticket-box">
              <img src=${logoBase64} alt="Logo" class="logo" />
              <div class="queue-number">${prefix}-${nomor}</div>
              <div class="service-info">Layanan: ${selectedQueue?.label || "Layanan"}</div>
              <div class="timestamp">Waktu Cetak: ${waktuCetak}</div>
            </div>
          </body>
        </html>
      `;
    
    console.log("🖨 Mengirim tiket ke Electron untuk dicetak...");
  
    window.electronAPI?.printTicket(ticketHTML)
      .then((filePath) => {
        console.log("✅ Tiket berhasil disimpan ke:", filePath);
      })
      .catch((err) => {
        console.error("❌ Gagal menyimpan tiket:", err);
      });
      console.log(window.electronAPI);
    } catch (error) {
      console.error("❌ Gagal membuat tiket:", error);
    }
  }, [name, phone, queueTypes]);
    

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
        <Modal.Body className="text-center py-4">
          <div className="mb-3">
            <FaCheckCircle className="text-success" size={50} />
          </div>
          <h5 className="mb-2">Tiket Berhasil Dibuat</h5>
          <p className="text-muted mt-2 mb-0">Silahkan Menunggu</p>
        </Modal.Body>
      </Modal>
    </Row>
  );
};

export default QueueServiceMenu;
