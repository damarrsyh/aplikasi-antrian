/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQueueLive } from "../../redux/Slice/queueNewSlice";
import { Row, Col, Card, Alert, Spinner } from "react-bootstrap"

const QueueList = () => {
  const dispatch = useDispatch();
  const { queueLive, loadingQueueLive, errorQueueLive } = useSelector(
    (state) => state.queueNew
  );

  useEffect(() => {
    dispatch(getQueueLive());
  }, [dispatch]);

  // Pastikan data ada sebelum mengaksesnya
  const themeColor = localStorage.getItem("themeColor") || "#007bff";
  const queueData = queueLive?.data?.live_antrian?.slice(1) || [];

  return (
    <>
    <Row className="flex-grow-1 g-2" style={{ width: "100%" }}>
      {queueData.length > 0 ? (
        queueData.map((queue, index) => (
          <Col key={index}>
            <Card className="shadow-sm">
              <Card.Header className="d-flex justify-content-between" style={{backgroundColor: themeColor, color: "white"}}>
                <h6 className="fw-semibold">
                  {queue.jenis_antrian} 
                </h6>
                <h6>
                  Jumlah: {queue.total}
                </h6>
              </Card.Header>
              <Card.Body className="d-flex justify-content-between text-center">
                {loadingQueueLive && <Spinner animation="border" className="d-block mx-auto my-3" />}

                {/* Error State */}
                {errorQueueLive && <Alert variant="danger">{errorQueueLive}</Alert>}
                <span>
                  <strong>Waiting:</strong> {queue.menunggu}
                </span>
                <span>
                  <strong>Called:</strong> {queue.dipanggil}
                </span>
              </Card.Body>
            </Card>
          </Col>
        ))
      ) : (
        <Col xs={12}>
          <Alert variant="secondary" className="text-center">
            Tidak ada data antrian.
          </Alert>
        </Col>
      )}
    </Row>
    </>
  )
}

export default QueueList
