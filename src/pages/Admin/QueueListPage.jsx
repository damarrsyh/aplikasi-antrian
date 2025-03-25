// import QueueTableNew from "../../components/Admin/QueueTableNew";
import QueueTable from "../../components/Admin/QueueTable";
import { Col, Container, Row } from "react-bootstrap";
import ErrorBoundary from "../../components/ErrorBoundary";

const QueueListPage = () => {
  
  return (
    <Container fluid className="p-4">
      <h5 className="m-0">Antrian</h5>
      <span>Antrian - List Antrian</span>
      <Row className="mt-3">
        <Col>
          <ErrorBoundary>
            <QueueTable/>
          </ErrorBoundary>
        </Col>
        {/* <Col md={4}>
          <QueueTableNew/>
        </Col> */}
      </Row>
    </Container>
  );
};

export default QueueListPage;
