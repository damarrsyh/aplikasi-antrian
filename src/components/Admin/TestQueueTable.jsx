import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQueueList, updateQueueStatusThunk, selectAllQueues } from "../../redux/Slice/queueSlice";
import { Card, Table, Container, Button, Pagination } from "react-bootstrap";

const TestQueueTable = () => {
  const dispatch = useDispatch();
  const queueList = useSelector(selectAllQueues); // Menggunakan selector agar kompatibel dengan Redux Adapter
  const status = useSelector((state) => state.queue.status);
  const user = useSelector((state) => state.auth.user);

  // eslint-disable-next-line no-unused-vars
  const [currentServingQueue, setCurrentServingQueue] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchQueueList());
    }
  }, [status, dispatch]);

  const handleCallQueue = (queue) => {
    if (!user || !user.loket) {
      alert("Loket tidak ditemukan! Pastikan Login dengan benar.");
      return;
    }


    setCurrentServingQueue(queue.id);
    dispatch(updateQueueStatusThunk({
      ...queue,
      status: "In Progress",
      time_start: new Date().toISOString(),
      counter: user.loket
    })).then(() => dispatch(fetchQueueList()));
  };

  const handleSkipQueue = (queue) => {
    dispatch(updateQueueStatusThunk({
      ...queue,
      status: "Missed"
    })).then(() => dispatch(fetchQueueList()));
  };

  const handleRecallQueue = (queue) => {
    dispatch(updateQueueStatusThunk({
      ...queue,
      status: "Waiting"
    })).then(() => dispatch(fetchQueueList()));
  };

  const handleCompleteQueue = (queue) => {
    dispatch(updateQueueStatusThunk({
      ...queue,
      status: "Complete",
      time_end: new Date().toISOString()
    })).then(() => {
      dispatch(fetchQueueList());
      setCurrentServingQueue(null);
    });
  };

  const sortedQueues = queueList
    .filter(q => ["Waiting", "In Progress", "Missed"].includes(q.status))
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  
  const totalPages = Math.ceil(sortedQueues.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQueues = sortedQueues.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container>
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span className="mb-0">List Data Antrian Customer</span>
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
              <tr className="text-center">
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
                    <td className="text-center fw-bold">{queue.customer?.queue_number}</td>
                    <td>{queue.service?.service_name}</td>
                    <td className="text-center">  
                    <span className={`status-badge ${
                        queue.status === "Waiting" ? "status-waiting" :
                        queue.status === "In Progress" ? "status-in-progress" :
                        queue.status === "Complete" ? "status-complete" :
                        queue.status === "Missed" ? "status-missed" : "bg-secondary"
                      }`}>
                        {queue.status}
                      </span>
                    </td>
                    <td>
                      <span className="d-flex justify-content-center gap-2">
                        {queue.status === "Waiting" && (
                          <Button className="btn-action btn-call" size="sm" onClick={() => handleCallQueue(queue)}>
                            Panggil
                          </Button>
                        )}
                        {queue.status === "In Progress" && (
                          <Button className="btn-action btn-skip" size="sm" onClick={() => handleSkipQueue(queue)}>
                            Lewati
                          </Button>
                        )}
                        {queue.status === "Missed" && (
                          <Button className="btn-action btn-recall" size="sm" onClick={() => handleRecallQueue(queue)}>
                            Panggil Ulang
                          </Button>
                        )}
                        {queue.status === "In Progress" && (
                          <Button className="btn-action btn-complete" size="sm" onClick={() => handleCompleteQueue(queue)}>
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
