import { Col, Container, Row } from "react-bootstrap"
import QueueSettingsDisplay from "../../components/Admin/QueueSettingsDisplay"  

const QueueSettingsDisplayPage = () => {
  return (
    <Container fluid className="p-4">
      <h5 className="m-0">Settings</h5>
      <span>Settings - Setting Display Antrian</span>
      <Row className="mt-3">
        <Col>
          <QueueSettingsDisplay/>
        </Col>
      </Row>
    </Container>
  )
}

export default QueueSettingsDisplayPage
