import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQueueList, updateQueueStatusThunk } from "../../redux/queueSlice";
import { Card, Table, Container, Button, Pagination, Modal } from "react-bootstrap";

const TestQueueTable = () => {
  const dispatch = useDispatch();
  const { queueList, status } = useSelector((state) => state.queue);
  const [showModal, setShowModal] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [currentServingQueue, setCurrentServingQueue] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchQueueList());
    }
  }, [status, dispatch]);

  const handleCallQueue = (queue) => {
    if (currentServingQueue) return; // Cegah pemanggilan baru jika masih ada yang dilayani
    
    setSelectedQueue(queue);
    setShowModal(true);
    setCurrentServingQueue(queue.id);
  
    dispatch(updateQueueStatusThunk({ 
      queueId: queue.id, 
      newStatus: "In Progress",
      queueNumber: queue.customer.queue_number,
      customerName: queue.customer.customer_name,
      serviceName: queue.service.service_name
    })).then(() => dispatch(fetchQueueList()));
  
    // Tutup modal otomatis setelah 1 menit jika customer tidak datang
    setTimeout(() => {
      if (currentServingQueue === queue.id) {
        setShowModal(false);
        dispatch(updateQueueStatusThunk({ 
          queueId: queue.id, 
          newStatus: "Missed",
          queueNumber: queue.customer.queue_number,
          customerName: queue.customer.customer_name,
          serviceName: queue.service.service_name
        })).then(() => dispatch(fetchQueueList()));
        setCurrentServingQueue(null);
      }
    }, 60000); // 1 menit
  };

  const handleConfirmCall = () => {
    dispatch(updateQueueStatusThunk({ 
      queueId: selectedQueue.id, 
      newStatus: "In Progress", 
      queueNumber: selectedQueue.queue_number,
      customerName: selectedQueue.customer_name,
      serviceName: selectedQueue.service_name }))
      .then(() => {
        dispatch(fetchQueueList());
        setShowModal(false);
      });
  };

  const handleCompleteQueue = (queue) => {
    console.log("Queue data on complete:", queue);
    dispatch(updateQueueStatusThunk({ 
      queueId: queue.id, 
      newStatus: "Completed",
      queueNumber: queue?.queue_number,
      customerName: queue?.customer_name,
      serviceName: queue?.service_name
    })).then(() => {
      dispatch(fetchQueueList());
      setCurrentServingQueue(null);
    });
  };

  const sortedQueues = [...queueList]
  .filter(q => q.status === "Waiting" || q.status === "In Progress") // ✅ Tetap tampilkan "In Progress"
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
          <Pagination>
            <Pagination.Prev onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
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
                    <td>{queue.customer?.customer_name || queue.customer_name}</td>
                    <td>{queue.customer?.queue_number || queue.queue_number}</td>
                    <td>{queue.service?.service_name || queue.service_name}</td>
                    <td className="text-center">  
                      <span className={`px-2 py-1 text-white text-center fw-bold rounded d-inline-block ${
                        queue.status === "Waiting" ? "bg-warning" :
                        queue.status === "In Progress" ? "bg-primary" :
                        queue.status === "Completed" ? "bg-success" : "bg-secondary"
                      }`}>
                        {queue.status}
                      </span>
                    </td>
                    <td>
                      {queue.status === "Waiting" && (
                        <Button variant="info" size="sm" onClick={() => handleCallQueue(queue)} disabled={!!currentServingQueue}>
                          Panggil
                        </Button>
                      )}
                      {queue.status === "In Progress" && (
                        <Button variant="success" size="sm" onClick={() => handleCompleteQueue(queue)}>
                          Selesai
                        </Button>
                      )}
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
      
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Panggil Antrian</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Nomor Antrian: <strong>{selectedQueue?.customer?.queue_number}</strong></p>
          <p>Nama Customer: {selectedQueue?.customer?.name}</p>
          <p>Silakan panggil ulang jika customer belum datang dalam 1 menit.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
          <Button variant="warning" onClick={() => handleCallQueue(selectedQueue)}>Panggil Ulang</Button>
          <Button variant="primary" onClick={handleConfirmCall}>Terpanggil</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TestQueueTable;
