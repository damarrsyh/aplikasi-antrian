import { Col, Container, Row } from "react-bootstrap";
import ErrorBoundary from "../../components/ErrorBoundary";
import QueueCall from "../../components/Admin/QueueCall";
import QueueWait from "../../components/Admin/QueueWait";
import QueueDone from "../../components/Admin/QueueDone";
import QueueLive from "../../components/Admin/QueueLive";

const QueueListPage = () => {
  return (
    <Container fluid className="p-4">
      {/* Header Halaman */}
      <header className="mb-3">
        <h5 className="m-0">Antrian</h5>
        <span>Antrian - List Antrian</span>
      </header>

      {/* Section: Queue Call & Queue Wait */}
      <Row className="mb-3 g-3">
        <ErrorBoundary>
          {/* QueueLive di sebelah kanan (lebih besar) */}
          <Col xs={12} md={9}>
            <QueueLive />
          </Col>

          {/* QueueCall di sebelah kiri (lebih kecil) */}
          <Col xs={12} md={3}>
            <QueueCall />
          </Col>
        </ErrorBoundary>
      </Row>

      {/* Section: Queue Wait & Done */}
      <Row className="mb-3 g-3">
        <Col md={6} xs={12}>
          <QueueWait />
        </Col>
        <Col md={6} xs={12}>
          <QueueDone />
        </Col>
      </Row>
    </Container>
  );
};

export default QueueListPage;
