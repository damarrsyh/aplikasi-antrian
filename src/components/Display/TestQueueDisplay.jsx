import { useEffect, useState } from "react";
import { getProcessedQueues } from "../Admin/TestQueueActions";
import { Card, Container, Row, Col, ListGroup } from "react-bootstrap";
import ReactPlayer from "react-player";

const TestQueueDisplay = () => {
  const [queues, setQueues] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showVideo, setShowVideo] = useState(true);
  const colors = ["primary", "secondary", "success", "danger", "warning", "info", "dark"];

  const getRandomColor = (index) => {
    return colors[index % colors.length];
  };

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

  useEffect(() => {
    const interval = setInterval(() => {
      setShowVideo(!showVideo);
    }, 180000);

    return () => clearInterval(interval);
  }, [showVideo]);

  return (
    <Container fluid className="p-3" style={{ overflowX: "hidden", maxHeight: "100vh", overflow: "hidden"}}>
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
          {queues.length > 0 ? (
            // Card Antrian Dipanggil
            <Card className="shadow flex-grow-1 text-center"
                style={{ borderRadius: "10px", width: "100%", minHeight: "250px" }}>
              <Card.Header className="bg-info text-white">
                <h3 className="fw-bold">
                  NOMOR ANTRIAN
                </h3>
              </Card.Header>
              <Card.Body>
              <h1 className="display-3 fw-bold p-3">{queues[0].id}</h1>
              </Card.Body>
              <Card.Footer className="bg-info text-white">
                <h5 className="fw-bold">
                  {queues[0].operatorCounter ? `${queues[0].operatorCounter}` : "Loket Tidak Diketahui"}
                </h5>
              </Card.Footer>
            </Card>
          ) : (
            <p className="text-muted">Tidak ada antrian aktif</p>
          )}
        </Col>
        {/* Video */}
        <Col md={8} className="ps-3 d-flex align-items-stretch">
        {showVideo ? (
          <div className="w-100 d-flex transition" style={{ borderRadius: "10px", overflow: "hidden", flexGrow: 1 }}>
            <ReactPlayer 
              url="https://www.youtube.com/watch?v=FaU8BkqmXzo&pp=ygULc3RvY2sgdmlkZW8%3D" 
              controls 
              width="100%" 
              height="100%"
              className="react-player"
            />
          </div>
          ) : (
          <Card className="shadow flex-grow-1 transition" style={{ borderRadius: "10px", width: "100%", minHeight: "250px" }}>
            <Card.Header className="bg-warning text-white">
              <h3 className="fw-bold">
                CUSTOMER YANG TERLEWAT
              </h3>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {queues
                  .filter((q) => q.status === "Waiting" && new Date(q.createdAt) < new Date(currentTime.getTime() - 30 * 60 * 1000))
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .slice(0, 5) // Tambahkan slice(0, 5) untuk menampilkan hanya 5 data teratas
                  .map((q, i) => (
                    <ListGroup.Item key={i} className="d-flex justify-content-between flex-column">
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">{q.id}</span>
                        <span className="text-muted">{q.status} - {new Date(q.createdAt).toLocaleTimeString()}</span>
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
            {/* List Antrian Setiap Layanan */}
            {Array.from(new Set(queues.map((queue) => queue.serviceName))).map((serviceName, index) => (
              <Col key={index} md={4} className="mb-3">
                <Card className="shadow border-0">
                  <Card.Header 
                    className={`bg-${getRandomColor(index)} text-white text-capitalize`}
                  >
                    <h5>
                      List Antrian {serviceName}
                    </h5>
                  </Card.Header>
                  <ListGroup variant="flush">
                    {queues
                      .filter((q) => q.status === "Waiting")
                      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                      .slice(0, 7) // Tambahkan slice(0, 5) untuk membatasi jumlah data
                      .map((q, i) => (
                        <ListGroup.Item key={i} className="d-flex justify-content-between flex-column">
                          <div className="d-flex justify-content-between">
                            <span className="fw-bold">{q.id}</span>
                            <span className="text-muted">{q.status} - {new Date(q.createdAt).toLocaleTimeString()}</span>
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
