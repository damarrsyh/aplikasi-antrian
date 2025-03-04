import { useState, useEffect } from "react";
import { ProgressBar, Card, Container, Col, Row } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";

const initialData = [
  { name: "Kylie Daniels", opps: 42, deals: 30, value: "$408,747", winRate: 71 },
  { name: "Stephen Flores", opps: 30, deals: 18, value: "$331,265", winRate: 60 },
  { name: "Mike Novak", opps: 38, deals: 20, value: "$314,191", winRate: 53 },
  { name: "Anna Cole", opps: 48, deals: 24, value: "$441,457", winRate: 50 },
  { name: "Christopher Jenkins", opps: 49, deals: 24, value: "$527,738", winRate: 49 },
  { name: "Curtis Miller", opps: 36, deals: 16, value: "$415,355", winRate: 44 },
  { name: "Karen Castillo", opps: 40, deals: 16, value: "$376,828", winRate: 40 },
  { name: "Tyler Bryant", opps: 39, deals: 12, value: "$364,636", winRate: 40 },
  { name: "Jennifer Mata", opps: 41, deals: 16, value: "$420,634", winRate: 39 },
  { name: "David Howard", opps: 41, deals: 12, value: "$443,969", winRate: 29 },
  { name: "Susan Anderson", opps: 39, deals: 12, value: "$352,754", winRate: 29 },
  { name: "Olivia Smith", opps: 49, deals: 10, value: "$387,029", winRate: 20 },
];

const Leaderboard = () => {
  const [data, setData] = useState(initialData.slice(0, 10)); // Ambil 10 data teratas

  useEffect(() => {
    document.body.style.overflow = "hidden"; // Mencegah scroll
    return () => {
      document.body.style.overflow = "auto"; // Kembalikan scroll saat unmount
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const updatedData = prevData.map((item) => ({
          ...item,
          winRate: Math.max(10, Math.min(100, item.winRate + (Math.random() * 10 - 5))),
        }));

        return updatedData.sort((a, b) => b.winRate - a.winRate).slice(0, 10); // Tetap hanya 10 data
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container fluid style={{ backgroundColor: "black", color: "#fff", height: "100vh", padding: "20px" }}>
      <Row className="h-100">
        <Col className="col-lg-8 p-0">
          <Card className="p-3 h-100" style={{ backgroundColor: "#1c283e", color: "#fff" }}>
            <Card.Title>Opportunities</Card.Title>
            <p className="text-secondary">Current Month</p>

            {/* Header Grid */}
            <motion.div
              className="grid-header"
              style={{
                display: "grid",
                gridTemplateColumns: "50px 1fr 120px 120px 120px 120px",
                gap: "10px",
                padding: "10px",
                backgroundColor: "#2b3a55",
                borderRadius: "5px",
                fontWeight: "bold",
              }}
            >
              <span>#</span>
              <span>Employee</span>
              <span className="text-center">SPK</span>
              <span className="text-center">Complaint</span>
              <span className="text-center">Penjualan</span>
              <span className="text-center">Win Rate</span>
            </motion.div>

            {/* List Grid (Animated) */}
            <AnimatePresence>
              {data.map((item, index) => (
                <motion.div
                  key={item.name}
                  layoutId={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="grid-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "50px 1fr 120px 120px 120px 120px",
                    gap: "10px",
                    padding: "15px",
                    backgroundColor: "#162238",
                    borderRadius: "5px",
                    marginTop: "5px",
                  }}
                >
                  <span>{index + 1}</span>
                  <span>{item.name}</span>
                  <span className="text-center">{item.opps}</span>
                  <span className="text-center">{item.deals}</span>
                  <span className="text-center">{item.value}</span>
                  <ProgressBar
                    now={item.winRate}
                    label={`${Math.round(item.winRate)}%`}
                    variant={item.winRate > 50 ? "success" : item.winRate > 30 ? "warning" : "danger"}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </Card>
        </Col>

        <Col className="col-lg-4">
          <Card className="p-3 mb-2" style={{ backgroundColor: "#1c283e", color: "#fff" }}>
            <Card.Title>Pipeline Forecast</Card.Title>
            <h2>$5,320,700</h2>
          </Card>
          <Card className="p-3" style={{ backgroundColor: "#1c283e", color: "#fff" }}>
            <Card.Title>Conversion Rate</Card.Title>
            <div>
              <p>Previous 30 days</p>
              <ProgressBar now={75} label="75%" variant="success" />
            </div>
            <div className="mt-3">
              <p>Previous 90 days</p>
              <ProgressBar now={68} label="68%" variant="success" />
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Leaderboard;
