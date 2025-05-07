import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const FooterMonitor = () => {
  return (
      <Container fluid className='p-2 rounded' style={{ backgroundColor: "#c1e0f5" }}>
        <Row>
          <Col className="text-center fw-semibold">
            <marquee behavior="scroll" direction="left" scrollamount="5" style={{ fontSize: '28px', color: '#333' }}>
              <i>Terima kasih telah menggunakan layanan Pandawa24Jam.</i>
            </marquee>
          </Col>
        </Row>
      </Container>
  );
};

export default FooterMonitor;
