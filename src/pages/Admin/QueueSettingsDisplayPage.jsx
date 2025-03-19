import { Container } from "react-bootstrap"
import QueueSettingsDisplay from "../../components/Admin/QueueSettingsDisplay"  

const QueueSettingsDisplayPage = () => {
  return (
    <Container fluid className="p-4">
      <h3>Setting Display Antrian</h3>
      <QueueSettingsDisplay/>
    </Container>
  )
}

export default QueueSettingsDisplayPage
