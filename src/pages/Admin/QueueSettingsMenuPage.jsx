import { Container } from "react-bootstrap"
import QueueSettingsMenu from "../../components/Admin/QueueSettingsMenu"

const QueueSettingsMenuPage = () => {
  return (
    <Container fluid className="p-4">
      <h3>Settings Menu Layanan</h3>
          <QueueSettingsMenu/>
    </Container>
  )
}

export default QueueSettingsMenuPage
