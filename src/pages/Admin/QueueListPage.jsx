import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQueueList } from "../../redux/queueSlice";
import TestQueueTable from "../../components/Admin/TestQueueTable";

const QueueListPage = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.queue);

  useEffect(() => {
    dispatch(fetchQueueList()); // Panggil langsung saat komponen dimuat
  }, [dispatch]);

  return (
    <div className="container mt-2">
      <h2 className="ms-3">Daftar Antrian</h2>
      {status === "loading" && <p>Memuat data...</p>}
      {status === "failed" && <p className="text-danger">Error: {error}</p>}
      <TestQueueTable />
    </div>
  );
};

export default QueueListPage;
