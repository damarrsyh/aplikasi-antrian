/* eslint-disable react/prop-types */
import { Row, Col, Card, ListGroup } from "react-bootstrap"

const QueueList = ({ queueList }) => {

  const themeColor = localStorage.getItem("themeColor") || "#007bff";

  return (
    <>
    <Row className="flex-grow-1" style={{ width: "100%" }}>
      {Array.from(new Set(queueList.map((queue) => queue.customer.nama_antrian))).map((serviceName, index) => (
        <Col key={index} md={4} className="mb-3">
          <Card className="shadow border-0">
            <Card.Header className={`text-white text-capitalize`} style={{backgroundColor: themeColor}}>
              <h5>List Antrian {serviceName}</h5>
            </Card.Header>
            <ListGroup variant="flush">
              {queueList
                .filter((q) => q.customer.status === "Waiting" && q.customer.nama_antrian === serviceName)
                .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                .slice(0, 3)
                .map((q, i) => (
                  <ListGroup.Item key={i} className="d-flex justify-content-between flex-column">
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold">{q.customer.nomor_antrian}</span>
                      <span className="text-muted fw-bold">{q.customer.status} - {q.created_at ? new Date(q.created_at).toLocaleTimeString() : "Waktu Tidak Diketahui"}</span>
                    </div>
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </Card>
        </Col>
      ))}
    </Row>
    </>
  )
}

export default QueueList
