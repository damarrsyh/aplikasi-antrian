import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQueueList } from "../../redux/Slice/queueSlice";
import TestQueueTable from "../../components/Admin/TestQueueTable";
import { Col, Container, Row } from "react-bootstrap";

const QueueListPage = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.queue);

  useEffect(() => {
    dispatch(fetchQueueList()); // Panggil langsung saat komponen dimuat
  }, [dispatch]);

  return (
    <Container fluid className="p-4">
      <h3>List Antrian</h3>
      <Row>
        <Col>
          {status === "loading" && <p>Memuat data...</p>}
          {status === "failed" && <p className="text-danger">Error: {error}</p>}
          <TestQueueTable />
        </Col>
      </Row>
    </Container>
  );
};

export default QueueListPage;
