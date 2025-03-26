import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQueueDone } from "../../redux/Slice/queueNewSlice";
import { Table } from "react-bootstrap";

const QueueTable = () => {
  const dispatch = useDispatch();
  const { queueDone, loadingQueueDone, errorQueueDone } = useSelector(
    (state) => state.queueNew
  );

  // console.log("queueDone:", queueDone);

  useEffect(() => {
    dispatch(getQueueDone());
  }, [dispatch]);

  return (
    <div className="p-2">
      <span className="fw-bold">Antrian Selesai</span>
      {loadingQueueDone && <p>Loading...</p>}
      {errorQueueDone && <p style={{ color: "red" }}>{errorQueueDone}</p>}

      <Table striped bordered responsive hover className="mt-2">
        <thead>
          <tr>
            <th>No.</th>
            <th>Jenis Antrian</th>
            <th>Nomor</th>
            <th>Waktu Cetak</th>
          </tr>
        </thead>
        <tbody>
          {queueDone?.data?.map((item, index) =>
            item.list_selesai?.map((queue) => (
              <tr key={queue._id}>
                <td>{index + 1}</td>
                <td>{queue.jenis_antrian}</td>
                <td>{queue.nomor}</td>
                <td>{new Date(queue.waktu_cetak).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default QueueTable;
