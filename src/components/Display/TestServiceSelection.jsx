
// FILE INI UNTUK TEST TAMPILAN DATA DENGAN API

import { useEffect, useState } from "react";
import { getProcessedQueues } from "../Admin/TestQueueActions";
import { Container, Card, Row, Col, Table } from "react-bootstrap";

const ServiceSelection = () => {
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    getProcessedQueues().then(setQueues);
  }, []);

  return (
    <Container>
      <Row>
      {queues.map((operator) => (
        <Col key={operator.operatorId}>
          <h3>{operator.operatorName}</h3>
          <ul>
            {operator.queues.map((queue) => (
              <li key={queue.id}>{queue.serviceName}</li>
            ))}
          </ul>
        </Col>
      ))}
      </Row>
    </Container>
  );
};

export default ServiceSelection;

