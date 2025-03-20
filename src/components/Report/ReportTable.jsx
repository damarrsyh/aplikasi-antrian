import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQueueList, selectAllQueues } from "../../redux/Slice/queueSlice";
import { fetchReport } from "../../redux/Slice/reportSlice";
import { Table, Card, Form } from "react-bootstrap"

const ReportTable = () => {
  const dispatch = useDispatch();
  const queueList = useSelector(selectAllQueues);
  console.log("Report Antrian", queueList);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
      dispatch(fetchQueueList());
      dispatch(fetchReport());
  }, [dispatch]);

  const formatDateOnly = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp * 1000).toISOString().split("T")[0];
  };

  const filteredQueues = queueList
    .filter((q) => q.customer?.status === "Complete")
    .filter((q) => {
      if (!selectedDate) return true; // Jika tidak ada tanggal yang dipilih, tampilkan semua
      const startDate = formatDateOnly(q.customer?.time_start);
      const endDate = formatDateOnly(q.customer?.time_end);
      return startDate === selectedDate || endDate === selectedDate;
    })
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  // 🔹 Fungsi Konversi Timestamp ke Format "YYYY-MM-DD HH:mm:ss"
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp * 1000);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // 🔹 Fungsi Menghitung Durasi dalam Format "HH:mm:ss"
  const calculateDuration = (start, end) => {
    if (!start || !end) return "-";
    const durationInSeconds = end - start;

    const hours = String(Math.floor(durationInSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((durationInSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(durationInSeconds % 60).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <h5>Data Antrian Toko</h5>
          <span className="mb-0">filter berdasarkan rentan hari/tanggal</span>
        </div>
        <div>
          <Form.Control
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ maxWidth: "200px" }}
          />
          <span>Total Antrian: {filteredQueues.length}</span>
        </div>
      </Card.Header>
      <Card.Body>
      <Table striped bordered hover responsive>
          <thead>
            <tr className="text-center">
              <th>Operator</th>
              <th>Antrian</th>
              <th>No Antrian</th>
              <th>Status</th>
              <th>Waktu Mulai</th>
              <th>Waktu Selesai</th>
              <th>Durasi</th>
            </tr>
          </thead>
          <tbody>
            {filteredQueues.length > 0 ? (
              filteredQueues.map((queue) => (
                <tr key={queue.id}>
                  <td>{queue.customer?.operator}</td>
                  <td>{queue.customer?.nama_antrian}</td>
                  <td>{queue.customer?.nomor_antrian}</td>
                  <td>{queue.customer?.status}</td>
                  <td>{formatDateTime(queue.customer?.time_start)}</td>
                  <td>{formatDateTime(queue.customer?.time_end)}</td>
                  <td>{calculateDuration(queue.customer?.time_start, queue.customer?.time_end)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted">Tidak ada antrian</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )
}

export default ReportTable
