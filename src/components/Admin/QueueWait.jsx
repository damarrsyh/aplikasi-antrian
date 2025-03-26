import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQueueWait } from "../../redux/Slice/queueNewSlice";
import { Table } from "react-bootstrap";

const QueueTable = () => {
  const dispatch = useDispatch();
  const { queueWait, loadingQueueWait, errorQueueWait } = useSelector(
    (state) => state.queueNew
  );

  console.log("queueWait:", queueWait);

  useEffect(() => {
    dispatch(getQueueWait());
  }, [dispatch]);

  return (
    <div className="p-2">
      <span className="fw-bold">Antrian Menunggu</span>
      {loadingQueueWait && <p>Loading...</p>}
      {errorQueueWait && <p style={{ color: "red" }}>{errorQueueWait}</p>}

      <Table striped bordered responsive hover className="mt-2">
        <thead>
          <tr>
            <th>No.</th>
            <th>Jenis Antrian</th>
            <th>Nomor Antrian</th>
            <th>Waktu Cetak</th>
          </tr>
        </thead>
        <tbody>
          {queueWait?.data?.map((item, index) =>
            item.list_menunggu?.map((queue) => (
              <tr key={queue._id}>
                <td>{index + 1}</td>
                <td>{queue.jenis_antrian}</td>
                <td className="text-center">{queue.nomor}</td>
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
