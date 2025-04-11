import { useDispatch, useSelector } from "react-redux";
import { getType, toggleQueueTypeStatus } from "../../redux/Slice/queueNewSlice";
import { Card, Form, Table } from "react-bootstrap";
import { useEffect } from "react";

export default function QueueTypeTable() {
  const dispatch = useDispatch();
  const { type } = useSelector((state) => state.queueNew);
  // console.log(type);
  const layanan = type?.cachedData || [];

  useEffect(() => {
    dispatch(getType());
  }, [dispatch]);

  const handleToggle = (jenisAntrian, currentStatus) => {
    dispatch(toggleQueueTypeStatus({ jenisAntrian, currentStatus }));
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title className="mb-3">Atur Jenis Layanan</Card.Title>
        <div className="table-responsive">
          <Table striped bordered hover size="sm">
            <thead className="text-center">
              <tr>
                <th>#</th>
                <th>Jenis Layanan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {layanan.map((item, index) => (
                <tr key={item.jenis_antrian}>
                  <td>{index + 1}</td>
                  <td>{item.jenis_antrian}</td>
                  <td className="text-center">
                    <Form.Check
                      type="switch"
                      id={`switch-${item.jenis_antrian}`}
                      checked={item.aktif === "Y"}
                      onChange={() =>
                        handleToggle(item.jenis_antrian, item.aktif)
                      }
                    />
                  </td>
                </tr>
              ))}
              {layanan.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center text-muted">
                    Tidak ada data layanan.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
}
