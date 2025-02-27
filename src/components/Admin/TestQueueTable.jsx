
// FILE INI UNTUK TEST TAMPILAN DATA DENGAN API

import { useEffect, useState } from "react";
import { getProcessedQueues } from "./TestQueueActions";
import { Card, Table, Container, Button, Modal, ListGroup } from "react-bootstrap";

const TestQueueTable = () => {
  const [queues, setQueues] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProcessedQueues();
      // Flatten data agar tidak dikelompokkan per operator
      const allQueues = data.flatMap((operator) =>
        operator.queues.map((queue) => ({
          ...queue,
          operatorName: operator.operatorName, // Menyimpan nama operator di setiap antrian
        }))
      );
      // Sort data: Prioritaskan yang Waiting dan urutkan berdasarkan createdAt
      allQueues.sort((a, b) => {
        if (a.status === "Waiting" && b.status !== "Waiting") return -1;
        if (a.status !== "Waiting" && b.status === "Waiting") return 1;
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
      setQueues(allQueues);
    };
    fetchData();
  }, []);

  // Data dummy untuk loket operator yang tersedia
  const availableCounters = [
    { id: "LKT001", name: "Loket 1" },
    { id: "LKT002", name: "Loket 2" },
    { id: "LKT003", name: "Loket 3" },
  ];

  // Handler untuk membuka modal dan memilih queue
  const handleCallQueue = (queue) => {
    setSelectedQueue(queue);
    setShowModal(true);
  };

  return (
    <Container>
      <Card className="shadow">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">List Antrian</h5>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover size="sm" responsive>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {queues.length > 0 ? (
                queues.map((queue) => (
                  <tr key={queue.id}>
                    <td>{queue.customerName}</td>
                    <td>{queue.customerEmail}</td>
                    <td>{queue.customerPhone}</td>
                    <td>{queue.serviceName}</td>
                    <td>
                      <span
                        className={`badge ${
                          queue.status === "Completed"
                            ? "bg-success"
                            : queue.status === "In Progress"
                            ? "bg-warning text-dark"
                            : "bg-danger"
                        }`}
                      >
                        {queue.status}
                      </span>
                    </td>
                    <td>{new Date(queue.createdAt).toLocaleString()}</td>
                    <td className="text-center p-2">
                      {queue.status !== "In Progress" && queue.status !== "Completed" && (
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => handleCallQueue(queue)}
                        >
                          Panggil Antrian
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center text-muted">
                    No queues available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal Pilih Loket */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Pilih Loket Operator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Memanggil antrian <strong>{selectedQueue?.customerName}</strong></p>
          <ListGroup>
            {availableCounters.map((counter) => (
              <ListGroup.Item key={counter.id} action>
                {counter.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default TestQueueTable;
