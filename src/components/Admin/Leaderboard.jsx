import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProgressBar, Card, Container, Col, Row, Spinner } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { fetchLeaderboard } from "../../redux/Slice/reportSlice";

const Leaderboard = () => {
  const dispatch = useDispatch();
  const { leaderboard, status } = useSelector(state => state.report);

  const [totalPendapatanSemuaOperator, setTotalPendapatanSemuaOperator] = useState(0);

  // Menggunakan useMemo agar tidak dihitung ulang setiap render
  const totalPendapatan = useMemo(() => {
    return leaderboard.reduce((total, operator) => total + operator.total_pendapatan, 0);
  }, [leaderboard]);

  // Fetch data leaderboard setiap awal render dan tiap 10 detik
  const fetchData = useCallback(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  useEffect(() => {
    fetchData();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(fetchData, 10000); // Setiap 10 detik agar lebih optimal
    return () => clearInterval(interval);
  }, [fetchData]);

  // Update total pendapatan setiap kali leaderboard berubah
  useEffect(() => {
    if (totalPendapatan !== totalPendapatanSemuaOperator) {
      setTotalPendapatanSemuaOperator(totalPendapatan);
    }
  }, [totalPendapatan, totalPendapatanSemuaOperator]);

  return (
    <Container fluid style={{ backgroundColor: "black", color: "#fff", height: "100vh", padding: "20px" }}>
      <Row className="h-100">
        <Col className="p-0">
          <Card className="p-3 h-100" style={{ backgroundColor: "#1c283e", color: "#fff" }}>
            <Card.Title>Opportunities</Card.Title>
            <p className="text-secondary">Current Data</p>

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
              {status === "loading" ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "100px" }}>
                  <Spinner animation="border" variant="light" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                leaderboard.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout // Tambahkan layout agar animasi lebih optimal
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{
                      type: "spring",
                      stiffness: 50, // Lebih rendah agar lebih smooth
                      damping: 12,
                      duration: 1.0, // Sedikit dipersingkat untuk performa
                    }}
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
                    <span className="text-center">{item.jumlah_spk}</span>
                    <span className="text-center">{item.jumlah_complaint}</span>
                    <span className="text-center">
                      {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(item.total_pendapatan)}
                    </span>
                    <ProgressBar
                      now={item.winRate}
                      label={`${item.winRate}%`}
                      variant={item.winRate > 50 ? "success" : item.winRate > 30 ? "warning" : "danger"}
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Leaderboard;
