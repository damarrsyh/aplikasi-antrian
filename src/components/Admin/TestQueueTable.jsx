import { useEffect, useState } from "react";
import { getProcessedQueues } from "./TestQueueActions";
import { Card, Table, Container, Button, Modal, ListGroup, Pagination } from "react-bootstrap";

const TestQueueTable = () => {
  const [queues, setQueues] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [calledQueues, setCalledQueues] = useState(new Set());

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Jumlah antrian per halaman

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProcessedQueues();
      const allQueues = data.flatMap((operator) =>
        operator.queues.map((queue) => ({
          ...queue,
          operatorName: operator.operatorName,
        }))
      );

      allQueues.sort((a, b) => {
        if (a.status === "Waiting" && b.status !== "Waiting") return -1;
        if (a.status !== "Waiting" && b.status === "Waiting") return 1;
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

      setQueues(allQueues);
    };
    fetchData();
  }, []);

  const availableCounters = [
    { id: "LKT001", name: "Loket 1" },
    { id: "LKT002", name: "Loket 2" },
    { id: "LKT003", name: "Loket 3" },
  ];

  const handleCallQueue = (queue) => {
    setSelectedQueue(queue);
    setShowModal(true);
    setCalledQueues((prev) => new Set(prev).add(queue.id)); // Tandai queue sebagai dipanggil
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQueues = queues.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(queues.length / itemsPerPage);

  return (
    <Container>
      <Card className="shadow">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">List Antrian</h5>
          {/* Pagination Controls */}
          <Pagination className="custom-pagination justify-content-center mb-0">
            <Pagination.Prev 
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1} 
            />
            {Array.from({ length: totalPages }, (_, index) => (
              <Pagination.Item 
                key={index + 1} 
                active={index + 1 === currentPage} 
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next 
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages} 
            />
          </Pagination>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover size="sm" responsive>
            <thead>
              <tr>
                <th>#</th>
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
              {currentQueues.length > 0 ? (
                currentQueues.map((queue, index) => (
                  <tr key={queue.id}>
                    <td className="">{index+1}</td>
                    <td className="">{queue.customerName}</td>
                    <td className="">{queue.customerEmail}</td>
                    <td className="">{queue.customerPhone}</td>
                    <td className="">{queue.serviceName}</td>
                    <td className="">
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
                    <td className="">{new Date(queue.createdAt).toLocaleString()}</td>
                    <td className=" text-center">
                      {queue.status !== "In Progress" && queue.status !== "Completed" && (
                        <Button
                          variant={calledQueues.has(queue.id) ? "warning" : "info text-white"}
                          size="sm"
                          onClick={() => handleCallQueue(queue)}
                        >
                          {calledQueues.has(queue.id) ? "Panggil Ulang" : "Panggil"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className=" text-center text-muted" colSpan="7">
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
