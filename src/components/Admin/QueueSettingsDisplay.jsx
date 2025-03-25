import { useState, useEffect } from "react";
import { Row, Col, Form, Button, Card } from "react-bootstrap"

const QueueSettingsDisplay = () => {

  const [themeColor, setThemeColor] = useState(localStorage.getItem("themeColor") || "#007bff");
  const [fontSize, setFontSize] = useState(localStorage.getItem("fontSize") || "16");
  const [largeQueueNumber, setLargeQueueNumber] = useState(
    JSON.parse(localStorage.getItem("largeQueueNumber")) ?? true
  );
  const [videoUrl, setVideoUrl] = useState(localStorage.getItem("videoUrl") || "");

  // Simpan pengaturan ke localStorage saat berubah
  useEffect(() => {
    localStorage.setItem("themeColor", themeColor);
    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("largeQueueNumber", JSON.stringify(largeQueueNumber));
    localStorage.setItem("videoUrl", videoUrl);
  }, [themeColor, fontSize, largeQueueNumber, videoUrl]);


  return (
    <Card>
      <Card.Header>Setting Display</Card.Header>
      <Card.Body>
        <Row className="d-flex align-items-center justify-content-center g-3">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Tema Warna</Form.Label>
              <Form.Control type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ukuran Teks</Form.Label>
              <Form.Control
                type="number"
                value={fontSize}
                min="12"
                max="30"
                onChange={(e) => setFontSize(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL Video Komersial</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan URL Video YouTube/Vimeo"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Tampilkan Nomor Antrian Besar"
                checked={largeQueueNumber}
                onChange={(e) => setLargeQueueNumber(e.target.checked)}
              />
            </Form.Group>

            <Button variant="primary" onClick={() => alert("Pengaturan disimpan!")}>Simpan Pengaturan</Button>
          </Col>

          {/* Preview Tampilan */}
          <Col md={6}>
            <h5>Preview Tampilan</h5>
            <Card className="shadow flex-grow-1 text-center text-white" style={{  borderRadius: "10px", width: "100%", minHeight: "250px" }}>
              <Card.Header style={{backgroundColor: themeColor}}>
              <h4 style={{ fontSize: `${fontSize}px` }} className="fw-bold">NOMOR ANTRIAN</h4>
              </Card.Header>
              <Card.Body className="bg-light text-dark">
              <h1 className="display-3 fw-bold p-4 m-2" style={{ fontSize: largeQueueNumber ? "60px" : "30px" }}>A123</h1>
              </Card.Body>
              <Card.Footer style={{backgroundColor: themeColor}}>
                <h4 className="fw-bold" style={{fontSize: `${fontSize}px`}}>Loket 1</h4>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

export default QueueSettingsDisplay
