import { Container, Row, Col } from "react-bootstrap";
import ReportStats from "../../components/Report/ReportStats";
import ReportTimes from "../../components/Report/ReportTimes";
import ReportChart from "../../components/Report/ReportCharts";
import ReportTable from "../../components/Report/ReportTable";

const QueueReportPage = () => {
  return (
    <Container fluid className="p-4">
      <h5 className="m-0">Antrian</h5>
      <span>Antrian - Report Antrian</span>
      <Row className="mt-3">
        <Col md={6}>
          <ReportStats />
        </Col>
        <Col md={6}>
          <ReportTimes />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <ReportTable />
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
