import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCustomers, getQueuesType } from "../../redux/Slice/queueNewSlice";
import { Card, Table } from "react-bootstrap";

const QueueTableNew = () => {
  const dispatch = useDispatch();
  const { customers, queuesType, status, error } = useSelector((state) => state.queueNew);

  useEffect(() => {
    dispatch(getCustomers());
    dispatch(getQueuesType());
  }, [dispatch]);

  console.log("Data Customer", customers);
  console.log("Data Service Type", queuesType);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <Card>
      <Card.Header>
        <span>Data Customer</span>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nama</th>
              <th>No Telepon</th>
              <th>Jumlah Order</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={customer._id || index}>
                <td>{customer.Nama}</td>
                <td>{customer.Telepon}</td>
                <td>{customer.Order}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default QueueTableNew;
