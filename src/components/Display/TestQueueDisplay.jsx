
// FILE INI UNTUK TEST TAMPILAN DATA DENGAN API

import { useEffect, useState } from "react";
import { getProcessedQueues } from "../Admin/TestQueueActions";
import { Card, Container } from "react-bootstrap";

const TestQueueDisplay = () => {
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProcessedQueues();
      // Ambil hanya antrian yang masih berlangsung atau menunggu, lalu urutkan
      const sortedQueues = data
        .flatMap((operator) => operator.queues)
        .filter((queue) => queue.status !== "Completed")
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      setQueues(sortedQueues);
    };

    fetchData();
    const interval = setInterval(fetchData, 2000); // Auto-refresh tiap 5 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <Container className="mt-4 text-center">
      <h2 className="mb-4">Layar Antrian</h2>
      {queues.length > 0 ? (
        <Card className="shadow p-4">
          <h1 className="display-3 text-primary">{queues[0].id}</h1>
          <h4>{queues[0].customerName}</h4>
          <p>{queues[0].serviceName}</p>
        </Card>
      ) : (
        <p className="text-muted">Tidak ada antrian aktif</p>
      )}
    </Container>
  );
};

export default TestQueueDisplay;

