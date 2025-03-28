import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQueueLive } from "../../redux/Slice/queueNewSlice";
import { Spinner, Alert, Card, Col, Row } from "react-bootstrap";

const QueueLive = () => {
  const dispatch = useDispatch();
  const { queueLive, loadingQueueLive, errorQueueLive } = useSelector(
    (state) => state.queueNew
  );

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
      <Card.Body>
        {/* Loading State */}
        {loadingQueueLive && <Spinner animation="border" className="d-block mx-auto my-3" />}

        {/* Error State */}
        {errorQueueLive && <Alert variant="danger">{errorQueueLive}</Alert>}

        {/* Data Antrian */}
        <Row className="g-3">
          {queueData.length > 0 ? (
            queueData.map((queue, index) => (
              <Col key={index} xs={12} sm={6} md={4}>
                <Card className="shadow-sm" style={{fontSize: 12}}>
                  <Card.Header className="d-flex justify-content-between bg-info-subtle text-center">
                    <span className="fw-semibold">
                      {queue.jenis_antrian} 
                    </span>
                    <span>
                      Jumlah: {queue.total}
                    </span>
                  </Card.Header>
                  <Card.Body className="d-flex justify-content-between text-center">
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
      </Card.Body>
    </Card>
  );
};

export default QueueLive;
