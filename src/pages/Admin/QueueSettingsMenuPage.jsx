import { Col, Container, Row } from "react-bootstrap"
import QueueSettingsMenu from "../../components/Admin/QueueSettingsMenu"

const QueueSettingsMenuPage = () => {
  return (
    <Container fluid className="p-4">
      <h3>Settings Menu Layanan Page</h3>
      <Row>
        <Col>
          <QueueSettingsMenu/>
        </Col>
      </Row>
    </Container>
  )
}

export default QueueSettingsMenuPage
