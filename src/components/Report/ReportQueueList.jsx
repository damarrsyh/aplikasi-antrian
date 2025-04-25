import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQueueDateNow, getType } from "../../redux/Slice/queueNewSlice";
import { Card, Table, Container, Alert } from "react-bootstrap";
import { FaExclamationTriangle } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ReportQueueList = () => {
  const dispatch = useDispatch();
  const { queueDateNow, loadingQueueDateNow, errorQueueDateNow, type } = useSelector(
    (state) => state.queueNew
  );

  const [delayedLoading, setDelayedLoading] = useState(true);

  useEffect(() => {
    dispatch(getQueueDateNow());
    dispatch(getType());

    // Delay loading minimal 1.5 detik biar animasi terlihat
    const timer = setTimeout(() => {
      setDelayedLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [dispatch]);

  const isTypeReady =
    type && Array.isArray(type.cachedData) && type.cachedData.length > 0;

  const jenisAntrianMap = isTypeReady
    ? type.cachedData.reduce((acc, item) => {
        acc[item.kd_jenis_antrian] = item.kd_identifikasi;
        return acc;
      }, {})
    : {};

  const formatNomorAntrian = (kdJenis, nomor) => {
    const prefix = jenisAntrianMap[kdJenis] || "";
    return `${prefix}${String(nomor).padStart(3, "0")}`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Belum dilayani";
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loadingQueueDateNow || delayedLoading) {
    return (
      <Card>
      <Card.Header>
        <Skeleton height={24} width={200} />
      </Card.Header>
      <Card.Body>
        <Table responsive striped bordered hover className="mb-0" style={{ fontSize: 12 }}>
          <thead>
            <tr>
              <th>No</th>
              <th>Nomor</th>
              <th>Jenis Antrian</th>
              <th>Counter</th>
              <th>Operator</th>
              <th>Email</th>
              <th>Waktu Cetak</th>
              <th>Waktu Dilayani</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index}>
                <td><Skeleton width={20} /></td>
                <td><Skeleton width={60} /></td>
                <td><Skeleton width={80} /></td>
                <td><Skeleton width={60} /></td>
                <td><Skeleton width={100} /></td>
                <td><Skeleton width={140} /></td>
                <td><Skeleton width={120} /></td>
                <td><Skeleton width={120} /></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
    );
  }
  
  if (errorQueueDateNow) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <Alert variant="danger" className="text-center">
          <FaExclamationTriangle size={30} className="mb-2 text-danger" />
          <Alert.Heading>Terjadi Kesalahan</Alert.Heading>
          <p>{errorQueueDateNow}</p>
        </Alert>
      </Container>
    );
  }

  const rawData = queueDateNow?.data?.[0] || {};
  const queueData = rawData?.data_now?.data || [];
  const totalQueue = rawData?.data_now?.total_qlast || 0;
  const reportDate = rawData?.data_now?.date || "Tanggal tidak tersedia";

  return (
    <Card className="mb-2">
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
        <Table responsive striped bordered hover className="mb-0" style={{ fontSize: 12 }}>
          <thead>
            <tr>
              <th>No</th>
              <th>Nomor</th>
              <th>Jenis Antrian</th>
              <th>Counter</th>
              <th>Operator</th>
              <th>Email</th>
              <th>Waktu Cetak</th>
              <th>Waktu Dilayani</th>
            </tr>
          </thead>
          <tbody>
            {queueData.length > 0 ? (
              queueData.map((item, index) => (
                <tr key={item._id || index}>
                  <td>{index + 1}</td>
                  <td>{formatNomorAntrian(item.kd_jenis_antrian, item.nomor)}</td>
                  <td>{item.kd_jenis_antrian}</td>
                  <td>Loket {item.counter || "-"}</td>
                  <td>{item.user || "-"}</td>
                  <td>{item.email || "-"}</td>
                  <td>{formatDateTime(item.waktu_cetak)}</td>
                  <td>{formatDateTime(item.waktu_dilayani)}</td>
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
