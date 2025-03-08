import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQueueList, updateQueueStatusThunk } from "../../redux/queueSlice";
import { Card, Table, Container, Button, Pagination } from "react-bootstrap";

const TestQueueTable = () => {
  const dispatch = useDispatch();
  const { queueList, status } = useSelector((state) => state.queue);
  // eslint-disable-next-line no-unused-vars
  const [currentServingQueue, setCurrentServingQueue] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchQueueList());
    }
  }, [status, dispatch]);

  // PANGGIL ANTRIAN

  const handleCallQueue = (queue) => {
    setCurrentServingQueue(queue.id);
    dispatch(updateQueueStatusThunk({
      ...queue,
      status: "In Progress",
      time_start: new Date().toISOString()
    })).then(() => dispatch(fetchQueueList()));
  };

  // SKIP ANTRIAN
  
  const handleSkipQueue = (queue) => {
    dispatch(updateQueueStatusThunk({
      ...queue,
      status: "Missed"
    })).then(() => dispatch(fetchQueueList()));
  };

  // PANGGIL ULANG ANTRIAN

  const handleRecallQueue = (queue) => {
    dispatch(updateQueueStatusThunk({
      ...queue,
      status: "Waiting"
    })).then(() => dispatch(fetchQueueList()));
  };

  // SELESAI DILAYANI

  const handleCompleteQueue = (queue) => {
    dispatch(updateQueueStatusThunk({
      ...queue,
      status: "Complete"
    })).then(() => {
      dispatch(fetchQueueList());
      setCurrentServingQueue(null);
    });
  };

  const sortedQueues = [...queueList]
    .filter(q => ["Waiting", "In Progress", "Missed"].includes(q.status))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  
  const totalPages = Math.ceil(sortedQueues.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQueues = sortedQueues.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container>
      <Card className="shadow">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">List Antrian</h5>
          <Pagination className="custom-pagination">
            <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
          </Pagination>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Customer</th>
                <th>No Antrian</th>
                <th>Service</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentQueues.length > 0 ? (
                currentQueues.map((queue) => (
                  <tr key={queue.id}>
                    <td>{queue.customer?.customer_name}</td>
                    <td>{queue.customer?.queue_number}</td>
                    <td>{queue.service?.service_name}</td>
                    <td className="text-center">  
                      <span className={`px-2 py-1 text-white text-center fw-bold rounded d-inline-block ${
                        queue.status === "Waiting" ? "bg-warning" :
                        queue.status === "In Progress" ? "bg-primary" :
                        queue.status === "Complete" ? "bg-success" : "bg-secondary"
                      }`} style={{fontSize: "13px"}}>
                        {queue.status}
                      </span>
                    </td>
                    <td>
                      <span className="d-flex justify-content-center">
                        {queue.status === "Waiting" && (
                          <Button variant="info" size="sm" onClick={() => handleCallQueue(queue)}>
                            Panggil
                          </Button>
                        )}
                        {queue.status === "In Progress" && (
                          <Button variant="danger" size="sm" className="me-2" onClick={() => handleSkipQueue(queue)}>
                            Lewati
                          </Button>
                        )}
                        {queue.status === "Missed" && (
                          <Button variant="warning" size="sm" onClick={() => handleRecallQueue(queue)}>
                            Panggil Ulang
                          </Button>
                        )}
                        {queue.status === "In Progress" && (
                          <Button variant="success" size="sm" onClick={() => handleCompleteQueue(queue)}>
                            Selesai
                          </Button>
                        )}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">Tidak ada antrian</td>
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
