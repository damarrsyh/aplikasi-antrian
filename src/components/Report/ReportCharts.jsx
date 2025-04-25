import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReport } from "../../redux/Slice/reportSlice";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, Spinner } from "react-bootstrap";

const ReportChart = () => {
  const dispatch = useDispatch();
  const { queuePerformance, status } = useSelector((state) => state.report);

  useEffect(() => {
    dispatch(fetchReport());
  }, [dispatch]);

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <h5 className="fw-bold text-center">Performa Total Antrian</h5>
      </Card.Header>
      <Card.Body>
        {status === "loading" ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={queuePerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#007bff" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card.Body>
    </Card>
  );
};

export default ReportChart;
