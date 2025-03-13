import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReport } from "../../redux/Slice/reportSlice";
import { Card, Spinner } from "react-bootstrap";

const ReportStats = () => {
  const dispatch = useDispatch();
  const { totalCustomers, status } = useSelector((state) => state.report);

  useEffect(() => {
    dispatch(fetchReport());
  }, [dispatch]);

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <h5 className="fw-bold text-center">Total Customer</h5>
      </Card.Header>
      <Card.Body>
        <div className="text-center">
          {status === "loading" ? (
            <Spinner animation="border" />
          ) : (
            <h2 className="fw-bold">{totalCustomers}</h2>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ReportStats;
