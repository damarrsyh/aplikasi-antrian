import { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import ReactPlayer from "react-player";
import { getQueueDisplayData } from "../Admin/QueueActions";

const QueueDisplay = () => {
  const [queueData, setQueueData] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setQueueData(getQueueDisplayData());
  }, []);

  // Pindah data setiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prevIndex) => (prevIndex + 1) % queueData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [queueData]);

  // Data antrian yang akan ditampilkan (5 antrian dari total 25)
  const currentTicket = queueData[startIndex] || { number: "-", counter: "-" };

  return (
    <Container fluid className="p-3" style={{ overflowX: "hidden" }}>
      <Row className="mb-3 g-0">
        {/* Informasi Bisnis & Nomor Antrian Utama */}
        <Col md={4} className="px-3 d-flex flex-column justify-content-between">
          <div 
            className="mb-3 p-3 text-white bg-dark d-flex justify-content-between align-items-center position-relative"
            style={{ borderRadius: "10px" }}
          >
            <div className="flex-grow-1">
              <h5>Pandawa24Jam</h5>
              <p>CS: 081234567891</p>
            </div>
            <div className="position-absolute top-50 end-0 translate-middle-y me-3">
              <h4 className="mb-0">{currentTime.toLocaleTimeString()}</h4>
            </div>
          </div>

          <Card className="flex-grow-1 d-flex align-items-center justify-content-center text-center"
                style={{ borderRadius: "10px", padding: "30px", width: "100%", minHeight: "250px" }}>
            <Card.Body>
              <h5 className="mb-2"><strong>NOMOR ANTRIAN</strong></h5>
              <p style={{ fontSize: "50px", fontWeight: "bold", margin: "10px 0" }}>
                {currentTicket.number}
              </p>
              <h5 className="mt-2">
                <strong>Menuju Loket: {currentTicket.counter}</strong>
              </h5>
            </Card.Body>
          </Card>
        </Col>

        {/* Video Player */}
        <Col md={8} className="px-3 d-flex align-items-stretch">
          <div className="w-100 d-flex">
            <ReactPlayer 
              url="https://www.youtube.com/watch?v=FaU8BkqmXzo&pp=ygULc3RvY2sgdmlkZW8%3D" 
              controls 
              width="100%" 
              height="100%"
              className="react-player"
              style={{ borderRadius: "10px", overflow: "hidden", flexGrow: 1 }}
            />
          </div>
        </Col>
      </Row>

      {/* Loket Antrian */}
      <Row className="d-flex flex-wrap g-0">
        <Col className="d-flex p-2">
          <Card className="flex-grow-1"
          style={{ borderRadius: "10px", width: "100%", minHeight: "150px" }}>
            <Card.Title className="p-3">
              <h2>
                List Antrian Layanan
              </h2>
              </Card.Title>
            <Row>
              <Col>
                <Card.Body>
                  <Card.Title>List Antrian Layanan</Card.Title>
                  <p>data antrian</p>
                </Card.Body>
              </Col>
              <Col>
                <Card.Body>
                  <Card.Title>List Antrian Layanan</Card.Title>
                  <p>data antrian</p>
                </Card.Body>
              </Col>
              <Col>
                <Card.Body>
                  <Card.Title>List Antrian Layanan</Card.Title>
                  <p>data antrian</p>
                </Card.Body>
              </Col>
              <Col>
                <Card.Body>
                  <Card.Title>List Antrian Layanan</Card.Title>
                  <p>data antrian</p>
                </Card.Body>
              </Col>
              <Col>
                <Card.Body>
                  <Card.Title>List Antrian Layanan</Card.Title>
                  <p>data antrian</p>
                </Card.Body>
              </Col>
              <Col>
                <Card.Body>
                  <Card.Title>List Antrian Layanan</Card.Title>
                  <p>data antrian</p>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default QueueDisplay;
