import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQueueList, updateQueueStatusThunk, selectAllQueues } from "../../redux/Slice/queueSlice";
import { Card, Table, Button, Pagination, Alert } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";

const QueueTable = () => {
  const dispatch = useDispatch();
  const queueList = useSelector(selectAllQueues);
  const { status, error } = useSelector((state) => state.queue);
  const [dataReady, setDataReady] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const itemsPerPage = 5;

  useEffect(() => {
      dispatch(fetchQueueList());
  }, [dispatch]);

useEffect(() => {
  if (status === "succeeded") {
    const timer = setTimeout(() => setDataReady(true), 3000);
    return () => clearTimeout(timer); // Cleanup timer saat unmount
  }
}, [status]);

  const handleCallQueue = (queue) => {
    if (!user || !user.loket) {
      alert("Loket tidak ditemukan! Pastikan Login dengan benar.");
      return;
    }

    dispatch(updateQueueStatusThunk({
      ...queue,
      customer: {
        ...queue.customer,
        status: "In Progress",
        operator: user.name,
        email: user.email,
        counter: user.loket,
        time_start: Math.floor(Date.now() / 1000),
      },
      updated_at: new Date().toISOString()
    })).then(() => dispatch(fetchQueueList()));
  };

  const handleSkipQueue = (queue) => {
    dispatch(updateQueueStatusThunk({
      ...queue,
      customer: {
        ...queue.customer,
        status: "Missed",
        operator: null,
        email: null,
        counter: null,
        time_start: null
      }
    })).then(() => dispatch(fetchQueueList()));
  };

  const handleRecallQueue = (queue) => {
    dispatch(updateQueueStatusThunk({
      ...queue,
      customer: {
        ...queue.customer,
        status: "Waiting"
      }
    })).then(() => dispatch(fetchQueueList()));
  };

  const handleCompleteQueue = (queue) => {
    dispatch(updateQueueStatusThunk({
      ...queue,
      customer: {
        ...queue.customer,
        status: "Complete",
        counter: null,
        time_end: Math.floor(Date.now() / 1000),
      },
    })).then(() => {
      dispatch(fetchQueueList());
    });
  };

  const sortedQueues = queueList
    .filter(q => ["Waiting", "In Progress", "Missed"].includes(q.customer?.status))
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  
    const totalPages = Math.ceil(sortedQueues.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentQueues = sortedQueues.slice(indexOfFirstItem, indexOfLastItem);

  const getPageNumbers = () => {
    if (totalPages <= 3) {
      return [...Array(totalPages)].map((_, i) => i + 1);
    }
  
    if (currentPage <= 2) {
      return [1, 2, 3, 4, '...'];
    }
  
    if (currentPage >= totalPages - 1) {
      return ['...',totalPages -3, totalPages - 2, totalPages - 1, totalPages];
    }
  
    return ['...', currentPage -1 , currentPage , currentPage +1 , '...'];
  };
  
  const pageNumbers = getPageNumbers();

  return (
    <Card className="shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span className="mb-0">Panggil Antrian Customer</span>
        <Pagination className="custom-pagination">
          <Pagination.Prev 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1} 
          />
          {pageNumbers.map((page, index) => (
            <Pagination.Item  
              key={index} 
              active={page === currentPage} 
              onClick={() => typeof page === 'number' && setCurrentPage(page)}
              disabled={page === '...'}
            >
              {page}
            </Pagination.Item>
          ))}

          <Pagination.Next 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </Card.Header>
      <Card.Body>
        {/* 🔹 Tampilkan loading di dalam tabel jika data masih diambil */}
        {status === "loading" || !dataReady ? (
          isMobile ? (
            /* 🔹 Skeleton Loading untuk Mobile View (Card) */
            <div className="d-flex flex-column gap-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="card p-3 shadow-sm">
                  <div className="skeleton" style={{ width: "80%", height: "20px" }}></div>
                  <div className="skeleton mt-2" style={{ width: "60%", height: "18px" }}></div>
                  <div className="skeleton mt-2" style={{ width: "50%", height: "18px" }}></div>
                  <div className="skeleton mt-3" style={{ width: "100%", height: "35px" }}></div>
                </div>
              ))}
            </div>
          ) : (
            /* 🔹 Skeleton Loading untuk Desktop/Table */
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
                {[...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td><div className="skeleton" style={{ width: "60%" }}></div></td>
                    <td><div className="skeleton" style={{ width: "60%" }}></div></td>
                    <td><div className="skeleton" style={{ width: "60%" }}></div></td>
                    <td><div className="skeleton" style={{ width: "60%" }}></div></td>
                    <td><div className="skeleton" style={{ width: "60%" }}></div></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )
        ) : status === "failed" ? (
          /* 🔹 Error Handling */
          <Alert variant="danger" className="text-center">
            <p>Error: {error}</p>
            <Button variant="outline-danger" onClick={() => dispatch(fetchQueueList())}>
              Coba Lagi
            </Button>
          </Alert>
        ) : (
          isMobile ? (
            /* 🔹 Card View untuk Mobile */
            <div className="d-flex flex-column gap-3">
              {currentQueues.length > 0 ? (
                currentQueues.map((queue) => (
                  <div key={queue.id} className="card p-3 shadow-sm">
                    <h5>{queue.customer?.customer_name}</h5>
                    <p className="text-muted">No Antrian: <strong>{queue.customer?.nomor_antrian}</strong></p>
                    <p>Layanan: {queue.customer?.nama_antrian}</p>
                    <span className={`status-badge ${
                        queue.customer.status === "Waiting" ? "status-waiting" :
                        queue.customer.status === "In Progress" ? "status-in-progress" :
                        queue.customer.status === "Complete" ? "status-complete" :
                        queue.customer.status === "Missed" ? "status-missed" : "bg-secondary"
                      }`}>
                      {queue.customer.status}
                    </span>
                    <div className="mt-3 d-flex gap-2">
                      {queue.customer.status === "Waiting" && (
                        <Button className="btn-action btn-call" size="sm" onClick={() => handleCallQueue(queue)}>
                          Panggil
                        </Button>
                      )}
                      {queue.customer.status === "In Progress" && (
                        <Button className="btn-action btn-skip" size="sm" onClick={() => handleSkipQueue(queue)}>
                          Lewati
                        </Button>
                      )}
                      {queue.customer.status === "Missed" && (
                        <Button className="btn-action btn-recall" size="sm" onClick={() => handleRecallQueue(queue)}>
                          Panggil Ulang
                        </Button>
                      )}
                      {queue.customer.status === "In Progress" && (
                        <Button className="btn-action btn-complete" size="sm" onClick={() => handleCompleteQueue(queue)}>
                          Selesai
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">Tidak ada antrian</p>
              )}
            </div>
          ) : (
            /* 🔹 Table View untuk Desktop */
            <div className="table-responsive-wrapper">
              <Table striped bordered hover className="table-responsive-custom">
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
                        <td className="text-center fw-bold">{queue.customer?.nomor_antrian}</td>
                        <td>{queue.customer?.nama_antrian}</td>
                        <td className="text-center">
                          <span className={`status-badge ${
                              queue.customer.status === "Waiting" ? "status-waiting" :
                              queue.customer.status === "In Progress" ? "status-in-progress" :
                              queue.customer.status === "Complete" ? "status-complete" :
                              queue.customer.status === "Missed" ? "status-missed" : "bg-secondary"
                            }`}>
                            {queue.customer.status}
                          </span>
                        </td>
                        <td>
                          <span className="d-flex justify-content-center gap-2">
                            {queue.customer.status === "Waiting" && (
                              <Button className="btn-action btn-call" size="sm" onClick={() => handleCallQueue(queue)}>
                                Panggil
                              </Button>
                            )}
                            {queue.customer.status === "In Progress" && (
                              <Button className="btn-action btn-skip" size="sm" onClick={() => handleSkipQueue(queue)}>
                                Lewati
                              </Button>
                            )}
                            {queue.customer.status === "Missed" && (
                              <Button className="btn-action btn-recall" size="sm" onClick={() => handleRecallQueue(queue)}>
                                Panggil Ulang
                              </Button>
                            )}
                            {queue.customer.status === "In Progress" && (
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
            </div>
          )
        )}
      </Card.Body>
    </Card>
  );
};

export default QueueTable;
