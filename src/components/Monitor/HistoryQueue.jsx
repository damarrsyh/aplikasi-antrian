import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQueueDone } from "../../redux/Slice/monitorSlice";
import { Alert, Card, Spinner } from "react-bootstrap";
import { isEmptyQueueError } from "../Shared/isEmptyQueueError";

const HistoryQueue = () => {
  const dispatch = useDispatch();
  const { queueDone, loadingQueueDone, errorQueueDone } = useSelector(
    (state) => state.monitor
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
            queueDone.data.slice(0, 4).map((queue) => (
              <Card key={queue._id} className="shadow-sm border-0" style={{ backgroundColor: "#c1e0f5" }}>

                <Card.Body className="p-2 text-center d-flex justify-content-between align-items-center">
                  <h1 className="fw-bold mb-0" style={{ fontSize: 35 }}>
                    {formatNomorAntrian(queue.kode_letter_antrian, queue.nomor)}
                  </h1>
                  <p className="mb-0 fw-semibold" style={{ fontSize: 18 }}>
                    Loket {queue.counter}
                  </p>
                </Card.Body>

                <Card.Footer 
                  className="p-1 d-flex justify-content-between align-items-center"         
                  style={{
                    backgroundColor: '#a3d2f2', // sedikit lebih gelap dari body supaya footer kelihatan beda
                    borderTop: '1px solid #90c8ef' // opsional: kasih garis tipis
                  }}>
                  <span className="badge bg-primary">Sudah Dipanggil</span>
                  <small className="fw-semibold">Terpanggil: {formatDateTime(queue.waktu_dilayani)}</small>
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

export default HistoryQueue;
