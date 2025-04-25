import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQueueLive } from "../../redux/Slice/queueNewSlice";
import { Spinner, Alert, Card, Table } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { isEmptyQueueError } from "../Shared/isEmpetyQueueError";

const QueueLive = () => {
  const dispatch = useDispatch();
  const { queueLive, loadingQueueLive, errorQueueLive } = useSelector(
    (state) => state.queueNew
  );
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    dispatch(getQueueLive());
  }, [dispatch]);

  // Pastikan data ada sebelum mengaksesnya
  const queueData = queueLive?.data?.live_antrian?.slice(1) || [];
  const totalAntrian = queueLive?.data?.live_antrian[0]?.total || 0;

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between bg-info-subtle">
        <span className="fw-bold">Live Antrian</span>
        <span className="text-danger">Total Antrian: {totalAntrian}</span>
      </Card.Header>
      <Card.Body className="">
        {/* Loading State */}
        {loadingQueueLive && <Spinner animation="border" className="d-block mx-auto my-3" />}

        {/* Error State */}
        {errorQueueLive && !isEmptyQueueError(errorQueueLive) && (
          <Alert variant="danger">{errorQueueLive}</Alert>
        )}

        {/* Data Antrian */}
        {isMobile ? (
          <div className="d-flex flex-column gap-3">
            {queueData.length > 0 ? (
              queueData.map((queue, index) => (
                <div key={index} className="card shadow-sm p-3">
                  <div className="d-flex justify-content-between text-center">
                    <h5 className="fw-semibold">{queue.jenis_antrian}</h5>
                  </div>
                  <div className="d-flex justify-content-between text-center">
                    <span>
                      <strong className="text-warning">Waiting:</strong> {queue.menunggu}
                    </span>
                    <span>
                      <strong className="text-success">Called:</strong> {queue.dipanggil}
                    </span>
                    <span>
                      <strong>
                        Jumlah: {queue.total}
                      </strong>
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <Alert variant="secondary" className="text-center">
                Tidak ada data antrian.
              </Alert>
            )}
          </div>
        ) : (
          <>
          {queueData.length > 0 ? (
            <Table striped bordered hover size="sm" responsive className="mb-0" style={{ fontSize: 12 }}>
              <thead className="table-info text-center">
                <tr>
                  <th>Jenis Antrian</th>
                  <th>Waiting</th>
                  <th>Called</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {queueData.map((queue, index) => (
                  <tr key={index}>
                    <td className="fw-semibold">{queue.jenis_antrian}</td>
                    <td>{queue.menunggu}</td>
                    <td>{queue.dipanggil}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="secondary" className="text-center">
              Tidak ada data antrian.
            </Alert>
          )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default QueueLive;
