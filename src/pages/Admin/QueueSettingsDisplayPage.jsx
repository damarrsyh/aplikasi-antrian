import QueueTable from "../../components/Admin/QueueTable"

const QueueSettingsDisplayPage = () => {
  return (
    <div>
      <h2>Setting Display Antrian Page</h2>
      <QueueTable displayView={true}/>
    </div>
  )
}

export default QueueSettingsDisplayPage
