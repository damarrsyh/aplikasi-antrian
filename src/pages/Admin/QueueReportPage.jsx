import { Container, Row, Col } from "react-bootstrap";
import ReportStats from "../../components/Report/ReportStats";
import ReportTimes from "../../components/Report/ReportTimes";
import ReportChart from "../../components/Report/ReportCharts";

const QueueReportPage = () => {
  return (
    <Container fluid className="p-4">
      <h3>Laporan Antrian</h3>
      <Row>
        <Col md={6}>
          <ReportStats />
        </Col>
        <Col md={6}>
          <ReportTimes />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <ReportChart />
        </Col>
      </Row>
    </Container>
  )
}

export default QueueReportPage
