import { Container, Row, Col, Card } from "react-bootstrap";
import ReactPlayer from "react-player";

const sampleTickets = [
  { number: "A1", counter: "1" },
  { number: "A2", counter: "2" },
  { number: "A3", counter: "3" },
  { number: "A4", counter: "4" },
  { number: "A5", counter: "5" },
  { number: "A6", counter: "6" },
  { number: "A7", counter: "7" },
  { number: "A8", counter: "8" },
  { number: "A9", counter: "9" },
  { number: "A10", counter: "10" },
];

const QueueDisplay = () => {
  return (
    <Container fluid className="p-3" style={{ overflowX: "hidden" }}>
      <Row className="mb-3 g-0">
        {/* Informasi Bisnis & Nomor Antrian Utama */}
        <Col md={4} className="px-3 d-flex flex-column justify-content-between">
          <div className="mb-3 p-3 text-white bg-dark text-center" style={{ borderRadius: "10px" }}>
            <h4 className="mb-1">Jagowebdev.com</h4>
            <p className="mb-1">Jl. Zebra III No. 32, Pedurungan Kidul, Semarang</p>
            <p>Telp: 08561363962</p>
          </div>
          <Card className="flex-grow-1 d-flex align-items-center justify-content-center text-center"
                style={{ borderRadius: "10px", padding: "20px", width: "100%", minHeight: "250px" }}>
            <Card.Body>
              <h5 className="mb-2"><strong>NOMOR ANTRIAN</strong></h5>
              <h1 style={{ fontSize: "80px", fontWeight: "bold", margin: "10px 0" }}>A0</h1>
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
      <Row className="text-center d-flex flex-wrap justify-content-center row-cols-2 row-cols-md-3 row-cols-lg-5 g-0 px-2">
        {sampleTickets.map((ticket, index) => (
          <Col key={index} className="d-flex justify-content-center p-2">
            <Card className="d-flex align-items-center justify-content-center text-center flex-grow-1"
                  style={{ borderRadius: "10px", width: "100%", minHeight: "150px" }}>
              <Card.Body>
                <Card.Title>Nomor Antrian</Card.Title>
                <h2 style={{ fontSize: "40px", fontWeight: "bold" }}>{ticket.number}</h2>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      </Container>
  );
};

export default QueueDisplay;
