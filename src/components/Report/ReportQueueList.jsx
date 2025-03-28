import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQueueDateNow } from "../../redux/Slice/queueNewSlice";
import { Card, Table } from "react-bootstrap";

const ReportQueueList = () => {
  const dispatch = useDispatch();
  const { queueDateNow, loadingQueueDateNow, errorQueueDateNow } = useSelector(
    (state) => state.queueNew
  );

  useEffect(() => {
    dispatch(getQueueDateNow());
  }, [dispatch]);

  if (loadingQueueDateNow) {
    return <p>Loading data antrian...</p>;
  }

  if (errorQueueDateNow) {
    return <p style={{ color: "red" }}>Terjadi kesalahan: {errorQueueDateNow}</p>;
  }

  const queueData = queueDateNow?.[0]?.data_now?.data || [];
  const totalQueue = queueDateNow?.[0]?.data_now?.total_qlast || 0;
  const reportDate = queueDateNow?.[0]?.data_now?.date || "Tanggal tidak tersedia";

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between">
        <div>
          <h5>Data Antrian Hari Ini</h5>
        </div>
        <div className="d-flex flex-column">
          <span>{reportDate}</span>
          <span>Total Antrian: <strong>{totalQueue}</strong></span>
        </div>
      </Card.Header>
      <Card.Body>
        <Table responsive striped bordered hover className="mb-0">
          <thead>
            <tr>
              <th>No</th>
              <th>Waktu Cetak</th>
              <th>Waktu Dilayani</th>
              <th>Nomor</th>
              <th>Jenis Antrian</th>
              <th>Counter</th>
              <th>Operator</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {queueData.length > 0 ? (
              queueData.map((item, index) => (
                <tr key={item._id || index}>
                  <td>{index + 1}</td>
                  <td>{new Date(item.waktu_cetak).toLocaleString()}</td>
                  <td>{item.waktu_dilayani ? new Date(item.waktu_dilayani).toLocaleString() : "Belum Dilayani"}</td>
                  <td>{item.nomor}</td>
                  <td>{item.kd_jenis_antrian}</td>
                  <td>{item.counter || "-"}</td>
                  <td>{item.user || "-"}</td>
                  <td>{item.email || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  Tidak ada data antrian untuk hari ini.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default ReportQueueList;
