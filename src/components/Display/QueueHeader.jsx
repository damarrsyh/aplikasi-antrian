/* eslint-disable react/prop-types */
import { Container, Row, Col, Image } from "react-bootstrap";

const QueueHeader = ({currentTime}) => {

  return (
    <div className="shadow-sm mb-2 rounded text-white" style={{ backgroundColor: "#FF6961" }}>
      <Container fluid className="py-3 px-4">
        <Row className="align-items-center">
          {/* Logo */}
          <Col xs="auto">
            <Image src="/assets/logoPandawa.jpg" alt="Logo Pandawa" width={50} height={50} rounded />
          </Col>
    
          {/* Informasi Perusahaan */}
          <Col>
            <h5 className="fw-bold mb-1">PANDAWA24JAM</h5>
            <p className="mb-0">Customer Service: 0812-3456-7891</p>
          </Col>
    
          {/* Jam */}
          <Col xs="auto" className="text-end">
            <h1 className="mb-0 fw-bold">{currentTime.toLocaleTimeString()}</h1>
          </Col>
        </Row>
      </Container>
    </div>
    
  )
}

export default QueueHeader
