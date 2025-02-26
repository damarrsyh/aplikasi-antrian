import QueueTable from "../../components/Admin/QueueTable"

const QueueReportPage = () => {
  return (
    <div>
      <h2>Report Antrian Page</h2>
      <QueueTable reportView={true}/>
    </div>
  )
}

export default QueueReportPage
