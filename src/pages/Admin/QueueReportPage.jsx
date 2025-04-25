import { Container, Row, Col } from "react-bootstrap";
import ReportQueueList from "../../components/Report/ReportQueueList";
import MonthlyReport from "../../components/Report/MonthlyReport";
import ErrorBoundary from "../../components/ErrorBoundary";

const QueueReportPage = () => {
  return (
    <Container fluid className="p-4">
      <h5 className="m-0">Antrian</h5>
      <span>Antrian - Report Antrian</span>
      <Row className="mt-3">
        <Col>
          <ErrorBoundary>
            <MonthlyReport/>
            <ReportQueueList/>
          </ErrorBoundary>
        </Col>
      </Row>
    </Container>
  )
}

export default QueueReportPage
