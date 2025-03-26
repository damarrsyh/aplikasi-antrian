import { Card, Col, Container, Row } from "react-bootstrap";
import ErrorBoundary from "../../components/ErrorBoundary";
import QueueTable from "../../components/Admin/QueueTable";
import QueueWait from "../../components/Admin/QueueWait";
import QueueDone from "../../components/Admin/QueueDone";
import QueueLive from "../../components/Admin/QueueLive";

const QueueListPage = () => {
  
  return (
    <Container fluid className="p-4">
      <h5 className="m-0">Antrian</h5>
      <span>Antrian - List Antrian</span>
        <Row className="mt-3">
          <ErrorBoundary>
            <Col>
              <QueueTable/>
            </Col>
          </ErrorBoundary>
        </Row>
        <Row className="mt-3">
          <Col>
              <Card>
                <QueueWait/>
              </Card>
          </Col>
          <Col>
              <Card>
                  <QueueDone/>
              </Card>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Card>
              <QueueLive />
            </Card>
          </Col>
        </Row>
    </Container>
  );
};

export default QueueListPage;
