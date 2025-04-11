import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQueueDone, getType } from "../../redux/Slice/queueNewSlice";
import { Alert, Card, Spinner, Table } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";

const QueueDone = () => {
  const dispatch = useDispatch();
  const { queueDone, loadingQueueDone, errorQueueDone, type } = useSelector(
    (state) => state.queueNew
  );
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    dispatch(getQueueDone());
    dispatch(getType()); // Ambil data jenis antrian
  }, [dispatch]);

  // Mapping kd_jenis_antrian ke kd_identifikasi
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
    return `${prefix}${nomor}`;
  };

  const totalQueueDone = queueDone?.data?.reduce(
    (acc, item) => acc + (item.list_selesai?.length || 0),
    0
  );

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between bg-success-subtle">
        <span className="fw-bold">Antrian Selesai</span>
        <span className="text-danger">Total Antrian: {totalQueueDone}</span>
      </Card.Header>
      <Card.Body>
        {loadingQueueDone && <Spinner animation="border" className="d-block mx-auto my-3" />}
        {errorQueueDone && <Alert variant="danger">{errorQueueDone}</Alert>}

        {isMobile ? (
          <div className="d-flex flex-column gap-3">
            {totalQueueDone > 0 ? (
              queueDone?.data?.map((item) =>
                item.list_selesai?.map((queue) => (
                  <div key={queue._id} className="card p-3 shadow-sm">
                    <p className="fw-bold">{queue.jenis_antrian}</p>
                    <p>
                      Nomor Antrian:{" "}
                      <strong>
                        {formatNomorAntrian(queue.kd_jenis_antrian, queue.nomor)}
                      </strong>
                    </p>
                    <p>Waktu Cetak:{" "}
                      {new Date(queue.waktu_cetak).toLocaleString()}
                    </p>
                    <span className="fw-semibold bg-success p-2 rounded text-light">
                      Finished
                    </span>
                  </div>
                ))
              )
            ) : (
              <p className="text-center text-muted">Tidak ada antrian</p>
            )}
          </div>
        ) : (
          <Table striped bordered responsive hover className="mt-2 mb-0">
            <thead>
              <tr className="text-center">
                <th>Jenis Antrian</th>
                <th>Nomor Antrian</th>
                <th>Waktu Cetak</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {totalQueueDone > 0 ? (
                queueDone?.data?.map((item) =>
                  item.list_selesai?.map((queue) => (
                    <tr key={queue._id} className="text-center">
                      <td className="p-3">{queue.jenis_antrian}</td>
                      <td className="p-3">
                        {formatNomorAntrian(queue.kd_jenis_antrian, queue.nomor)}
                      </td>
                      <td className="p-3">{new Date(queue.waktu_cetak).toLocaleString()}</td>
                      <td className="p-3">
                        <span className="fw-semibold bg-success p-2 rounded text-light">
                          Finished
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

export default QueueDone;
