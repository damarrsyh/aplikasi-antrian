import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQueueDone } from "../../redux/Slice/queueNewSlice";
import { Alert, Card, Spinner } from "react-bootstrap";
import { isEmptyQueueError } from "../Shared/isEmpetyQueueError";

const QueueDone = () => {
  const dispatch = useDispatch();
  const { queueDone, loadingQueueDone, errorQueueDone } = useSelector(
    (state) => state.queueNew
  );

  useEffect(() => {
    dispatch(getQueueDone());
  }, [dispatch]);

  const totalQueueDone = queueDone?.data?.length || 0;

  const formatNomorAntrian = (kode, nomor) =>
    `${kode}${String(nomor).padStart(3, "0")}`;
  
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {loadingQueueDone && (
        <Spinner animation="border" className="d-block mx-auto my-3" />
      )}
      {errorQueueDone && !isEmptyQueueError(errorQueueDone) && (
        <Alert variant="danger">{errorQueueDone}</Alert>
      )}
        <div className="d-flex flex-column gap-2">
          {totalQueueDone > 0 ? (
            queueDone.data.map((queue) => (
              <Card key={queue._id} className="shadow-sm border-0" style={{ backgroundColor: "#E6F4EA" }}>
                <Card.Header className="py-2 d-flex justify-content-between align-items-center" style={{ backgroundColor: "#ACE1AF" }}>
                  <span className="fw-bold text-success">Nomor Terpanggil</span>
                  <small className="text-muted">Menunggu: {formatDateTime(queue.waktu_cetak)}</small>
                </Card.Header>

                <Card.Body className="py-3 text-center d-flex justify-content-between">
                  <h1 className="fw-bold mb-1" style={{ fontSize: 35 }}>
                    {formatNomorAntrian(queue.kode_letter_antrian, queue.nomor)}
                  </h1>
                  <p className="mb-0 fw-semibold" style={{ fontSize: 18 }}>
                    Loket {queue.counter}
                  </p>
                </Card.Body>

                <Card.Footer className="py-2 d-flex justify-content-between align-items-center" style={{ backgroundColor: "#ACE1AF" }}>
                  <span className="badge bg-success">Sudah Dipanggil</span>
                  <small className="text-muted">Terpanggil: {formatDateTime(queue.waktu_dilayani)}</small>
                </Card.Footer>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted">Tidak ada antrian</p>
          )}
        </div>
    </>
  );
};

export default QueueDone;
