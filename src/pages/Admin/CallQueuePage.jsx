import QueueTable from "../../components/Admin/QueueTable";

const CallQueuePage = () => {
  return (
    <div>
      <h2>Panggil Atrian Page</h2>
      <QueueTable callQueueView={true}/>
    </div>
  )
}

export default CallQueuePage
