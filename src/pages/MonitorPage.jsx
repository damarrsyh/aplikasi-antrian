/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import PromoDisplay from '../components/Monitor/PromoDisplay';
import CurrentQueue from '../components/Monitor/CurrentQueue';
import HistoryQueue from '../components/Monitor/HistoryQueue';
import HeaderMonitor from '../components/Monitor/HeaderMonitor';
import { Container, Row, Col } from 'react-bootstrap';
import FooterMonitor from '../components/Monitor/FooterMonitor';

const MonitorPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showVideo, setShowVideo] = useState(true);

  // Jam
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setShowVideo((prev) => !prev), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container fluid className="p-2" style={{ overflowX: "hidden", maxHeight: "100vh", overflow: "hidden" }}>
      <Row className="g-2 mb-2">
        <Col>
          <HeaderMonitor currentTime={currentTime} />
        </Col>
      </Row>
      <Row className="g-2">
        <Col md={8} className="d-flex flex-column align-items-stretch">
          <PromoDisplay showVideo={showVideo}/>
        </Col>
        <Col md={4} className="d-flex flex-column">
          <CurrentQueue/>
          <HistoryQueue/>
        </Col>
      </Row>
      <Row className='g-2 mt-1'>
        <Col>
          <FooterMonitor/>
        </Col>
      </Row>
    </Container>
  )
}

export default MonitorPage
