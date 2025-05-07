import { Container, Row, Col, Image } from "react-bootstrap";

const HeaderMonitor = ({currentTime}) => {

  return (
    <Container fluid className="shadow-sm rounded p-3" style={{ backgroundColor: "#c1e0f5"}}>
        <Row className="align-items-center">
          {/* Logo */}
          <Col xs="auto">
            <Image src="/assets/logoPandawa.jpg" alt="Logo Pandawa" width={70} height={70} rounded />
          </Col>
    
          {/* Informasi Perusahaan */}
          <Col>
            <h3 className="fw-bold mb-1">PANDAWA24JAM</h3>
            <p className="mb-0">Customer Service: 0812-3456-7891</p>
          </Col>
    
          {/* Jam */}
          <Col xs="auto" className="text-end">
            <h1 className="mb-0 fw-bold">{currentTime.toLocaleTimeString()}</h1>
          </Col>
        </Row>
    </Container>
  )
}

export default HeaderMonitor
