import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQueueList, updateQueueStatusThunk, selectAllQueues } from "../../redux/Slice/queueSlice";
import { Card, Table, Button, Pagination } from "react-bootstrap";

const QueueTable = () => {
  const dispatch = useDispatch();
  const queueList = useSelector(selectAllQueues);

  console.log("list Antrian", queueList);
  const user = useSelector((state) => state.auth.user);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
      dispatch(fetchQueueList());
  }, [dispatch]);

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
        <span className="mb-0">List Data Antrian Customer</span>
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
      </Card.Body>
    </Card>
  );
};

export default QueueTable;
