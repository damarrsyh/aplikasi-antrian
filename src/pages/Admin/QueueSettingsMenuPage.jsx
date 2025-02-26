import QueueTable from "../../components/Admin/QueueTable"

const QueueSettingsMenuPage = () => {
  return (
    <div>
      <h2>Settings Menu Layanan Page</h2>
      <QueueTable settingsView={true}/>
    </div>
  )
}

export default QueueSettingsMenuPage
