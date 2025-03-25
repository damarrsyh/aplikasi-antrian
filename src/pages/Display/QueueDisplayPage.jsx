import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQueueList, selectAllQueues } from "../../redux/Slice/queueSlice";
import { Container, Row, Col } from "react-bootstrap";
import QueueHeader from "../../components/Display/QueueHeader";
import QueueNumber from "../../components/Display/QueueNumber";
import QueueMedia from "../../components/Display/QueueMedia";
import QueueList from "../../components/Display/QueueList";

const QueueDisplayPage = () => {

  const dispatch = useDispatch();
  const queueList = useSelector(selectAllQueues);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showVideo, setShowVideo] = useState(true);
  const colors = ["primary", "secondary", "success", "danger", "warning", "info", "dark"];
  const getRandomColor = (index) => colors[index % colors.length];

  useEffect(() => {
      dispatch(fetchQueueList());
  }, [dispatch]);

  // Jam
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setShowVideo((prev) => !prev), 2000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Ambil antrian yang sedang "In Progress"
  const currentQueue = queueList.find(q => q.customer.status === "In Progress") || null;
  const missedCustomers = queueList.filter(q => q.customer.status === "Missed");


  return (
    <Container fluid className="p-3" style={{ overflowX: "hidden", maxHeight: "100vh", overflow: "hidden" }}>
      <Row className="mb-3 g-0">
      <Col md={4} className="d-flex flex-column justify-content-between">
        <QueueHeader currentTime={currentTime} />
        <QueueNumber currentQueue={currentQueue} queueList={queueList}/>
      </Col>
      <Col md={8} className="ps-3 d-flex align-items-stretch">
        <QueueMedia showVideo={showVideo} queueList={queueList} missedCustomers={missedCustomers}/>
      </Col>
      </Row>
      <Row className="g-0">
        <Col className="d-flex justify-content-center">
          <QueueList queueList={queueList} getRandomColor={getRandomColor}/>
        </Col>
      </Row>
    </Container>
  )
}

export default QueueDisplayPage
