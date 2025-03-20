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
      <Card.Header className="fw-bold">Setting Layanan</Card.Header>
      <Card.Body>
        <Table striped bordered hover className="w-100">
          <thead className="text-center">
            <tr>
              <th style={{width: "70%"}}>Layanan</th>
              <th style={{width: "30%", minWidth: "150px"}}>Status</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.nama}</td>
                <td>
                  <Form.Check
                    type="switch"
                    className="custom-switch text-center"
                    checked={servicesStatus[service.id]}
                    onChange={() => handleToggle(service.id)}
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
