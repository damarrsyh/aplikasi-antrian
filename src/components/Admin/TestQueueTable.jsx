import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQueueList, updateQueueStatus } from "../../redux/queueSlice";
import { Card, Table, Container, Button, Pagination } from "react-bootstrap";

const TestQueueTable = () => {
  const dispatch = useDispatch();
  const { queueList, status } = useSelector((state) => state.queue);
  const [calledQueues, setCalledQueues] = useState(new Set());

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchQueueList()); // Ambil daftar antrian dari mockDatabase
    }
  }, [status, dispatch]);

  const handleCallQueue = (queue) => {
    dispatch(updateQueueStatus({ queueId: queue.id, newStatus: "In Progress" }))
      .then(() => dispatch(fetchQueueList())); // Ambil ulang daftar setelah update

    setCalledQueues((prev) => new Set(prev).add(queue.id));
  };

  const sortedQueues = queueList
    .filter((queue) => queue.status === "Waiting") // Hanya antrian "Waiting"
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQueues = sortedQueues.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(queueList.length / itemsPerPage);

  return (
    <Container>
      <Card className="shadow">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">List Antrian</h5>
          <Pagination className="custom-pagination justify-content-center mb-0">
            <Pagination.Prev onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
            {Array.from({ length: totalPages }, (_, index) => (
              <Pagination.Item key={`page-${index + 1}`} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
          </Pagination>
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
              {currentQueues.length > 0 ? (
                currentQueues.map((queue) => (
                  <tr key={queue.id}>
                    <td>{queue.customerName}</td>
                    <td>{queue.customerEmail}</td>
                    <td>{queue.customerPhone}</td>
                    <td>{queue.serviceName}</td>
                    <td>
                      <span className={`badge ${queue.status === "Completed" ? "bg-success" : queue.status === "In Progress" ? "bg-warning text-dark" : "bg-danger"}`}>
                        {queue.status}
                      </span>
                    </td>
                    <td>{queue.createdAt ? new Date(queue.createdAt).toLocaleString() : "-"}</td>
                    <td className="text-center">
                      {queue.status === "Waiting" && (
                        <Button variant={calledQueues.has(queue.id) ? "warning" : "info text-white"} size="sm" onClick={() => handleCallQueue(queue)}>
                          {calledQueues.has(queue.id) ? "Panggil Ulang" : "Panggil"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center text-muted" colSpan="7">Tidak ada antrian tersedia</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TestQueueTable;
