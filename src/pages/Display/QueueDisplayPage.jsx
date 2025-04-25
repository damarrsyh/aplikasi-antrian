import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import QueueHeader from "../../components/Display/QueueHeader";
import QueueNumber from "../../components/Display/QueueNumber";
import QueueMedia from "../../components/Display/QueueMedia";
import QueueDone from "../../components/Display/QueueDone";

const QueueDisplayPage = () => {

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
      <Row className="g-2">
        <Col>
          <QueueHeader currentTime={currentTime} />
        </Col>
      </Row>
      <Row className="g-2">
        <Col md={8} className="d-flex flex-column align-items-stretch">
          <QueueMedia showVideo={showVideo}/>
        </Col>
        <Col md={4} className="d-flex flex-column">
          <QueueNumber/>
          <QueueDone/>
        </Col>
      </Row>
      <Row>
        <Col>
          
        </Col>
      </Row>
    </Container>
  )
}

export default QueueDisplayPage
