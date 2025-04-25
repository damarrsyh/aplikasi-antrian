import { Col, Container, Row } from "react-bootstrap";
import ErrorBoundary from "../../components/ErrorBoundary";
import QueueCall from "../../components/Admin/QueueCall";
// import QueueRecall from "../../components/Admin/QueueRecall"
import QueueWait from "../../components/Admin/QueueWait";
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
          {/* QueueLive di sebelah kiri (lebih besar) */}
          <Col xs={12} md={8}>
            <QueueWait />
          </Col>

          {/* QueueCall di sebelah kanan (lebih kecil) */}
          <Col xs={12} md={4}>
            <QueueCall />
            {/* <QueueRecall /> */}
            <QueueLive />
          </Col>

          {/* QueueRecall di sebelah kanan (lebih kecil) */}
        </ErrorBoundary>
      </Row>
    </Container>
  );
};

export default QueueListPage;
