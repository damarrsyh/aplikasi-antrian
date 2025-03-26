/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQueueByDateThunk } from "../../redux/Slice/queueNewSlice";
import { Table } from "react-bootstrap";

const ReportQueueList = ({ tanggal, type, nomor }) => {
  const dispatch = useDispatch();
  const { queuesByDate, loadingQueuesByDate, error } = useSelector((state) => state.queueNew);

  useEffect(() => {
    dispatch(fetchQueueByDateThunk({ tanggal, type, nomor }));
  }, [dispatch, tanggal, type, nomor]);

  if (loadingQueuesByDate) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Operator</th>
          <th>Nomor Antrian</th>
          <th>Jenis Antrian</th>
          <th>Counter</th>
          <th>Email</th>
          <th>Customer ID</th>
          <th>Waktu Cetak</th>
          <th>Waktu Dilayani</th>
        </tr>
      </thead>
      <tbody>
        {queuesByDate.length > 0 ? (
          queuesByDate.map((queue, index) => (
            <tr key={queue._id || index}>
              <td>{index + 1}</td>
              <td>{queue.user || "-"}</td>
              <td>{queue.nomor}</td>
              <td>{queue.kd_jenis_antrian}</td>
              <td>{queue.counter || "-"}</td>
              <td>{queue.email || "-"}</td>
              <td>{queue.customer}</td>
              <td>{new Date(queue.waktu_cetak).toLocaleString()}</td>
              <td>{queue.waktu_dilayani ? new Date(queue.waktu_dilayani).toLocaleString() : "-"}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="9" style={{ textAlign: "center" }}>Tidak ada data antrian</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default ReportQueueList;
