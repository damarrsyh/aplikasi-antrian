import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQueueList } from "../../redux/queueSlice";
import { Card, Container, Row, Col, ListGroup } from "react-bootstrap";
import ReactPlayer from "react-player";

const TestQueueDisplay = () => {
  const dispatch = useDispatch();
  const { queueList } = useSelector((state) => state.queue);
  console.log("data Display antrian", queueList);
  

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showVideo, setShowVideo] = useState(true);
  const colors = ["primary", "secondary", "success", "danger", "warning", "info", "dark"];

  const getRandomColor = (index) => {
    return colors[index % colors.length];
  };

  useEffect(() => {
    dispatch(fetchQueueList());
  }, [queueList.length]); // Akan update jika ada perubahan jumlah data
  

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowVideo((prev) => !prev);
    }, 180000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Ambil antrian yang sedang "In Progress"
  const activeQueues = queueList.filter((queue) => queue.status === "In Progress");

  return (
    <Container fluid className="p-3" style={{ overflowX: "hidden", maxHeight: "100vh", overflow: "hidden" }}>
      <Row className="mb-3 g-0">
        <Col md={4} className="d-flex flex-column justify-content-between">
          <div
            className="shadow mb-3 pt-3 ps-3 bg-primary text-white d-flex justify-content-between align-items-center position-relative"
            style={{ borderRadius: "10px" }}
          >
            <div className="flex-grow-1">
              <h4>Pandawa24Jam</h4>
              <p>CS: 081234567891</p>
            </div>
            <div className="position-absolute top-50 end-0 translate-middle-y me-3">
              <h4 className="mb-0">{currentTime.toLocaleTimeString()}</h4>
            </div>
          </div>
          {activeQueues.length > 0 ? (
            <Card className="shadow flex-grow-1 text-center" style={{ borderRadius: "10px", width: "100%", minHeight: "250px" }}>
              <Card.Header className="bg-info text-white">
                <h3 className="fw-bold">NOMOR ANTRIAN</h3>
              </Card.Header>
              <Card.Body>
                <h1 className="display-3 fw-bold p-3">{activeQueues[0].id}</h1>
              </Card.Body>
              <Card.Footer className="bg-info text-white">
                <h5 className="fw-bold">
                  {activeQueues[0].operatorCounter ? `${activeQueues[0].operatorCounter}` : "Loket Tidak Diketahui"}
                </h5>
              </Card.Footer>
            </Card>
          ) : (
            <p className="text-muted">Tidak ada antrian aktif</p>
          )}
        </Col>
        <Col md={8} className="ps-3 d-flex align-items-stretch">
          {showVideo ? (
            <div className="w-100 d-flex transition" style={{ borderRadius: "10px", overflow: "hidden", flexGrow: 1 }}>
              <ReactPlayer url="https://www.youtube.com/watch?v=FaU8BkqmXzo" controls width="100%" height="100%" className="react-player" />
            </div>
          ) : (
            <Card className="shadow flex-grow-1 transition" style={{ borderRadius: "10px", width: "100%", minHeight: "250px" }}>
              <Card.Header className="bg-warning text-white">
                <h3 className="fw-bold">CUSTOMER YANG TERLEWAT</h3>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {queueList
                    .filter((q) => q.status === "Waiting" && new Date(q.createdAt) < new Date(currentTime.getTime() - 30 * 60 * 1000))
                    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                    .slice(0, 7)
                    .map((q, i) => (
                      <ListGroup.Item key={i} className="d-flex justify-content-between flex-column">
                        <div className="d-flex justify-content-between">
                          <span className="fw-bold">{q.id}</span>
                          <span className="text-muted">
                            {q.status} - {new Date(q.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </ListGroup.Item>
                    ))}
                </ListGroup>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
      <Row className="g-0">
        <Col className="d-flex justify-content-center">
          <Row className="flex-grow-1" style={{ width: "100%" }}>
            {Array.from(new Set(queueList.map((queue) => queue.serviceName))).map((serviceName, index) => (
              <Col key={index} md={4} className="mb-3">
                <Card className="shadow border-0">
                  <Card.Header className={`bg-${getRandomColor(index)} text-white text-capitalize`}>
                    <h5>List Antrian {serviceName}</h5>
                  </Card.Header>
                  <ListGroup variant="flush">
                    {queueList
                      .filter((q) => q.status === "Waiting")
                      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                      .slice(0, 7)
                      .map((q, i) => (
                        <ListGroup.Item key={i} className="d-flex justify-content-between flex-column">
                          <div className="d-flex justify-content-between">
                            <span className="fw-bold">{q.queue_id}</span>
                            <span className="text-muted">
                              {q.status} - {new Date(q.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </ListGroup.Item>
                      ))}
                  </ListGroup>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default TestQueueDisplay;
