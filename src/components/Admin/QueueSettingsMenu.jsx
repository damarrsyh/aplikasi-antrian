import { useDispatch, useSelector } from "react-redux";
import { Table, Form, Card } from "react-bootstrap";
import { fetchServicesThunk, updateServiceStatusThunk } from "../../redux/Slice/queueSlice";
import { useEffect } from "react";

const QueueSettingsMenu = () => {
  const dispatch = useDispatch();
  const services = useSelector((state) => state.queue.services);
  const servicesStatus = useSelector((state) => state.queue.servicesStatus);

  useEffect(() => {
    dispatch(fetchServicesThunk());
  }, [dispatch]);

  const handleToggle = (serviceId) => {
    const newStatus = !servicesStatus[serviceId];
    dispatch(updateServiceStatusThunk({ serviceId, newStatus }));
  };

  return (
  <Card className="shadow-sm">
    <Card.Header>Setting Layanan</Card.Header>
    <Card.Body>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Layanan</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>{service.nama}</td>
              <td>
                <Form.Check
                  type="switch"
                  checked={servicesStatus[service.id]}
                  onChange={() => handleToggle(service.id)}
                  label={servicesStatus[service.id] ? "Aktif" : "Nonaktif"}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card.Body>
  </Card>
  )
}

export default QueueSettingsMenu
