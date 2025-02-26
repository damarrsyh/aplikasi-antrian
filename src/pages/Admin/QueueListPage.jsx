import QueueTable from "../../components/Admin/QueueTable";

const QueueListPage = () => {

  return (
    <div>
      <h2>Daftar Antrian</h2>
      <QueueTable showActions={false}/>
    </div>
  );
};

export default QueueListPage;
