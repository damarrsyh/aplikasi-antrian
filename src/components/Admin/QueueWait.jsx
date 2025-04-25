import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQueueWait, getType } from "../../redux/Slice/queueNewSlice";
import { Alert, Card, Spinner, Table } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { isEmptyQueueError } from "../Shared/isEmpetyQueueError";

const QueueWait = () => {
  const dispatch = useDispatch();
  const { queueWait, loadingQueueWait, errorQueueWait, type } = useSelector(
    (state) => state.queueNew
  );

  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    dispatch(getQueueWait());
    dispatch(getType());
  }, [dispatch]);

  // Mapping kd_jenis_antrian to kd_identifikasi
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

  const totalQueueWait = queueWait?.data?.reduce(
    (acc, item) => acc + (item.list_menunggu?.length || 0),
    0
  );

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between bg-warning-subtle">
        <span className="fw-bold">Antrian Menunggu</span>
        <span className="text-danger">Total Antrian: {totalQueueWait}</span>
      </Card.Header>
      <Card.Body>
        {loadingQueueWait && (
          <Spinner animation="border" className="d-block mx-auto my-3" />
        )}
        {errorQueueWait && !isEmptyQueueError(errorQueueWait) && (
          <Alert variant="danger">{errorQueueWait}</Alert>
        )}

          {isMobile ? (
          <div className="d-flex flex-column gap-3">
            {totalQueueWait > 0 ? (
              queueWait?.data?.map((item) =>
                item.list_menunggu?.map((queue) => (
                  <div key={queue._id} className="card p-3 shadow-sm">
                    <p className="fw-bold">{queue.jenis_antrian}</p>
                    <p>
                      Nomor Antrian:{" "}
                      <strong>
                        {formatNomorAntrian(queue.kd_jenis_antrian, queue.nomor)}
                      </strong>
                    </p>
                    <p>
                      Waktu Cetak:{" "}
                      {new Date(queue.waktu_cetak).toLocaleString()}
                    </p>
                    <span className="fw-semibold bg-warning p-2 rounded text-dark">
                      Waiting
                    </span>
                  </div>
                ))
              )
            ) : (
              <p className="text-center text-muted">Tidak ada antrian</p>
            )}
          </div>
        ) : (
          <Table striped bordered responsive hover size="sm" className="mb-0" style={{ fontSize: 12 }}>
            <thead>
              <tr className="text-center">
                <th>Jenis Antrian</th>
                <th>Nomor Antrian</th>
                <th>Waktu Cetak</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {totalQueueWait > 0 ? (
                queueWait?.data?.map((item) =>
                  item.list_menunggu?.map((queue) => (
                    <tr key={queue._id} className="text-center">
                      <td className="p-2">{queue.jenis_antrian}</td>
                      <td className="p-2">
                        {formatNomorAntrian(queue.kd_jenis_antrian, queue.nomor)}
                      </td>
                      <td className="p-2">
                        {new Date(queue.waktu_cetak).toLocaleString()}
                      </td>
                      <td className="p-2">
                        <span className="fw-semibold bg-warning p-1 rounded-1 text-dark">
                          Waiting
                        </span>
                      </td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    Data Kosong
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

export default QueueWait;
