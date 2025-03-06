import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQueueList, updateQueueStatusThunk } from "../../redux/queueSlice";
import { Card, Table, Container, Button, Pagination, Modal } from "react-bootstrap";

const TestQueueTable = () => {
  const dispatch = useDispatch();
  const { queueList, status } = useSelector((state) => state.queue);
  const [calledQueues, setCalledQueues] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchQueueList());
      // Ambil daftar antrian dari mockDatabase
    }
  }, [status, dispatch]); 

  const handleCallQueue = (queue) => {
    setSelectedQueue(queue);
    setShowModal(true); // Tampilkan modal
    dispatch(updateQueueStatusThunk({ 
      queueId: queue.id, 
      newStatus: "In Progress",
      queueNumber: queue.customer.queue_number // Pastikan queue_number ikut dikirim
    })).then(() => {
      dispatch(fetchQueueList()); // Refresh daftar antrian
    });
  
    setCalledQueues((prev) => new Set(prev).add(queue.id));
  
    // Timer 1 menit untuk memindahkan ke "Missed" jika customer tidak datang
    setTimeout(() => {
      const updatedQueue = queueList.find((q) => q.id === queue.id); // Cek status terbaru
      if (updatedQueue && updatedQueue.status === "In Progress") {
        dispatch(updateQueueStatusThunk({ 
          queueId: queue.id, 
          newStatus: "Missed",
          queueNumber: queue.queue_number 
        })).then(() => dispatch(fetchQueueList()));
      }
    }, 60000); // 1 menit
  };
    
  
  const sortedQueues = queueList
  .filter((queue) => queue.status === "Waiting") // Hanya antrian "Waiting"
  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  
  const totalPages = Math.ceil(sortedQueues.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    }
  }, [sortedQueues, totalPages, currentPage]); 
  
  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQueues = sortedQueues.slice(indexOfFirstItem, indexOfLastItem);

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
                <th>Service</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentQueues.length > 0 ? (
                currentQueues.map((queue) => (
                  <tr key={queue.queue_id || queue.id}>
                    <td>{queue.customer?.name}</td>
                    <td>{queue.service?.name}</td>
                    <td>
                      <span className={`badge ${queue.status === "Completed" ? "bg-success" : queue.status === "In Progress" ? "bg-warning text-dark" : "bg-danger"}`}>
                        {queue.status}
                      </span>
                    </td>
                    <td className="text-center">
                      {queue.status === "Waiting" && (
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
                  <td className="text-center text-muted" colSpan="7">Tidak ada antrian tersedia</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Panggil Ulang Antrian</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Nomor Antrian: <strong>{selectedQueue?.queue_number}</strong></p>
          <p>Nama Customer: {selectedQueue?.customer?.name}</p>
          <p>Apakah Anda ingin memanggil customer ini?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
          <Button
            variant="primary"
            onClick={() => {
              dispatch(updateQueueStatusThunk({ 
                queueId: selectedQueue.id, 
                newStatus: "In Progress",
                queueNumber: selectedQueue.queue_number
              })).then(() => {
                dispatch(fetchQueueList());
                setShowModal(false);
              });
            }}
          >
            Panggil Sekarang
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TestQueueTable;
