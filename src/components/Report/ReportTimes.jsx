import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReport } from "../../redux/Slice/reportSlice";
import { Card, Spinner } from "react-bootstrap";

const ReportTimes = () => {
  const dispatch = useDispatch();
  const { avgWaitTime, avgServiceTime, status } = useSelector((state) => state.report);

  useEffect(() => {
    dispatch(fetchReport());
  }, [dispatch]);

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <h5 className="fw-bold text-center">Rata-Rata Waktu</h5>
      </Card.Header>
      <Card.Body>
        <div className="text-center">
          {status === "loading" ? (
            <Spinner animation="border" />
          ) : (
            <>
              <p className="mb-1"><strong>Waktu Tunggu:</strong> {avgWaitTime}</p>
              <p className="mb-0"><strong>Waktu Pelayanan:</strong> {avgServiceTime}</p>
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ReportTimes;
