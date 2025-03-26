import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQueueLive } from "../../redux/Slice/queueNewSlice";
import { Table, Spinner, Alert } from "react-bootstrap";

const QueueTable = () => {
  const dispatch = useDispatch();
  const { queueLive, loadingQueueLive, errorQueueLive } = useSelector(
    (state) => state.queueNew
  );

  console.log("queueLive:", queueLive);

  useEffect(() => {
    dispatch(getQueueLive());
  }, [dispatch]);

  // Pastikan data ada sebelum mengaksesnya
  const queueData = queueLive?.data?.live_antrian?.slice(1) || [];
  const totalAntrian = queueLive?.data?.live_antrian[0]?.total || 0;

  return (
    <div className="p-2">
      <div className="d-flex justify-content-between">
        <span className="fw-bold">Live Antrian</span>
        <span className="fw-bold">Total Antrian :({totalAntrian})</span>
      </div>

      {/* Loading State */}
      {loadingQueueLive && <Spinner animation="border" className="d-block mx-auto my-3" />}

      {/* Error State */}
      {errorQueueLive && <Alert variant="danger">{errorQueueLive}</Alert>}

      {/* Table */}
      <Table striped bordered hover responsive className="mt-2">
        <thead>
          <tr>
            <th>Jenis Antrian</th>
            <th>Total</th>
            <th>Menunggu</th>
            <th>Dipanggil</th>
          </tr>
        </thead>
        <tbody>
          {queueData.length > 0 ? (
            queueData.map((queue, index) => (
              <tr key={index} className="text-center">
                <td>{queue.jenis_antrian}</td>
                <td>{queue.total}</td>
                <td>{queue.menunggu}</td>
                <td>{queue.dipanggil}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                Tidak ada data antrian.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default QueueTable;
