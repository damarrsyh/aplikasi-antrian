import { useEffect, useState } from "react";
import { getProcessedQueues } from "../Admin/TestQueueActions";
import { Card, Container, Row, Col, ListGroup } from "react-bootstrap";
import ReactPlayer from "react-player";

const TestQueueDisplay = () => {
  const [queues, setQueues] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProcessedQueues();
      // Ambil hanya antrian yang masih berlangsung atau menunggu, lalu urutkan
      const sortedQueues = data
        .flatMap((operator) => operator.queues)
        .filter((queue) => queue.status !== "Completed")
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      setQueues(sortedQueues);
    };

    fetchData();
    const interval = setInterval(fetchData, 2000); // Auto-refresh tiap 5 detik
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container fluid className="p-3" style={{ overflowX: "hidden" }}>
      <Row className="mb-3 g-0">
        <Col md={4} className="px-3 d-flex flex-column justify-content-between">
          <div 
            className="shadow mb-3 p-3 d-flex justify-content-between align-items-center position-relative"
            style={{ borderRadius: "10px" }}
          >
            <div className="flex-grow-1">
              <h5>Pandawa24Jam</h5>
              <p>CS: 081234567891</p>
            </div>
            <div className="position-absolute top-50 end-0 translate-middle-y me-3">
              <h4 className="mb-0">{currentTime.toLocaleTimeString()}</h4>
            </div>
          </div>
          {queues.length > 0 ? (
            <Card className="shadow flex-grow-1 d-flex align-items-center justify-content-center text-center"
                style={{ borderRadius: "10px", padding: "30px", width: "100%", minHeight: "250px" }}>
              <h1 className="display-3 text-primary">{queues[0].id}</h1>
              <h4>{queues[0].customerName}</h4>
              <p>{queues[0].serviceName}</p>
            </Card>
          ) : (
            <p className="text-muted">Tidak ada antrian aktif</p>
          )}
        </Col>
        <Col md={8} className="px-3 d-flex align-items-stretch">
          <div className="w-100 d-flex">
            <ReactPlayer 
              url="https://www.youtube.com/watch?v=FaU8BkqmXzo&pp=ygULc3RvY2sgdmlkZW8%3D" 
              controls 
              width="100%" 
              height="100%"
              className="react-player"
              style={{ borderRadius: "10px", overflow: "hidden", flexGrow: 1 }}
            />
          </div>
        </Col>
      </Row>
      <Row className="d-flex flex-wrap g-0">
        <Col className="d-flex p-3">
        <Card className="flex-grow-1"
          style={{ width: "100%" }}>
          <Card.Header>
            <h2>
              List Layanan antrian
            </h2>
          </Card.Header>
          <Row className="m-2">
            {Array.from(new Set(queues.map((queue) => queue.serviceName))).map((serviceName, index) => (
              <Col key={index} md={2}>
                <h3>{serviceName}</h3>
                  {queues
                    .filter((q) => q.serviceName === serviceName)
                    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                    .map((q, i) => (
                        <span key={i}>{q.serviceId} - {q.id} -  {new Date(q.createdAt).toLocaleTimeString()}</span>
                    ))}
              </Col>
            ))}
          </Row>
        </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TestQueueDisplay;
