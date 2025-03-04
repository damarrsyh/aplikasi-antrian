import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQueueList } from "../../redux/queueSlice";
import TestQueueTable from "../../components/Admin/TestQueueTable";

const QueueListPage = () => {
  const dispatch = useDispatch();
  const { queueList, status, error } = useSelector((state) => state.queue);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchQueueList());
    }
  }, [status, dispatch]);

  return (
    <div className="container mt-4">
      <h2>Daftar Antrian</h2>
      {status === "loading" && <p>Memuat data...</p>}
      {status === "failed" && <p className="text-danger">Error: {error}</p>}
      {status === "succeeded" && <TestQueueTable queueList={queueList} />}
    </div>
  );
};

export default QueueListPage;
