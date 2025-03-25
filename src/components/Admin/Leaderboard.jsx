import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProgressBar, Card, Container, Col, Row } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { fetchLeaderboard } from "../../redux/Slice/reportSlice";

const Leaderboard = () => {
  const dispatch = useDispatch();
  const { leaderboard, status } = useSelector((state) => state.report);
  const [dataReady, setDataReady] = useState(false);

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
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    if (status === "succeeded") {
      setTimeout(() => setDataReady(true), 2000);
    }
  }, [status]);

  return (
    <Container fluid className="leaderboard-container">
      <Row className="h-100">
        <Col className="p-0">
          <Card className="p-3 h-100 leaderboard-card">
            <Card.Title>Opportunities</Card.Title>
            <p className="text-secondary">Current Data</p>

            {/* Desktop & Tablet View (Grid) */}
            <div className="d-none d-md-block">
              <motion.div className="grid-header">
                <span>#</span>
                <span>Employee</span>
                <span className="text-center">SPK</span>
                <span className="text-center">Complaint</span>
                <span className="text-center">Penjualan</span>
                <span className="text-center">Win Rate</span>
              </motion.div>
            </div>

            <AnimatePresence>
              {status === "loading" || !dataReady ? (
                [...Array(10)].map((_, index) => (
                  <motion.div key={index} className="grid-row skeleton-row"></motion.div>
                ))
              ) : (
                <>
                  {/* Desktop & Tablet View (Grid) */}
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="d-none d-md-grid"
                  >
                    {leaderboard.map((item, index) => (
                      <motion.div
                        key={item.id}
                        layoutId={`leaderboard-item-${item.id}`}
                        transition={{ duration: 0.6, type: "spring", stiffness: 40, damping: 12 }}
                        className="grid-row"
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
                    ))}
                  </motion.div>

                  {/* Mobile View (Scrollable List) */}
                  <motion.div
                    className="d-md-none mobile-list"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{ maxHeight: "78vh", overflowY: "auto" }} // Scrollable
                  >
                    {leaderboard.map((item, index) => (
                      <motion.div
                        key={item.id}
                        layoutId={`mobile-item-${item.id}`}
                        transition={{ duration: 0.6, type: "spring", stiffness: 40, damping: 12 }}
                        className="mobile-card"
                      >
                        <div className="card-header">
                          <span className="rank">#{index + 1}</span>
                          <h5>{item.name}</h5>
                        </div>
                        <div className="card-body">
                          <p>SPK: {item.jumlah_spk}</p>
                          <p>Complaint: {item.jumlah_complaint}</p>
                          <p>Penjualan: {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(item.total_pendapatan)}</p>
                          <ProgressBar
                            now={item.winRate}
                            label={`${item.winRate}%`}
                            variant={item.winRate > 50 ? "success" : item.winRate > 30 ? "warning" : "danger"}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Leaderboard;
