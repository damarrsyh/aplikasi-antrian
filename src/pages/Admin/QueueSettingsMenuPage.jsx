import { Col, Container, Row } from "react-bootstrap"
import QueueSettingsMenu from "../../components/Admin/QueueSettingsMenu"

const QueueSettingsMenuPage = () => {
  return (
    <Container fluid className="p-4">
      <h5 className="m-0">Settings</h5>
      <span>Settings - Setting Menu Layanan</span>
      <Row className="mt-3">
        <Col>
          <QueueSettingsMenu/>
        </Col>
      </Row>
    </Container>
  )
}

export default QueueSettingsMenuPage
