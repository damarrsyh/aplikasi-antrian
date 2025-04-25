import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Form,
  Button,
  Table,
  Spinner,
  Alert,
  Row,
  Col,
  Card,
} from 'react-bootstrap';
import { getMonthlyReport } from '../../redux/Slice/queueNewSlice';
import { useMediaQuery } from 'react-responsive';

const bulanOptions = [
  { label: 'Januari', value: '01' },
  { label: 'Februari', value: '02' },
  { label: 'Maret', value: '03' },
  { label: 'April', value: '04' },
  { label: 'Mei', value: '05' },
  { label: 'Juni', value: '06' },
  { label: 'Juli', value: '07' },
  { label: 'Agustus', value: '08' },
  { label: 'September', value: '09' },
  { label: 'Oktober', value: '10' },
  { label: 'November', value: '11' },
  { label: 'Desember', value: '12' },
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i); // 5 tahun terakhir

const MonthlyReport = () => {
  const dispatch = useDispatch();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    String(now.getMonth() + 1).padStart(2, '0')
  );
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const { monthlyReport, loadingMonthlyReport, errorMonthlyReport } = useSelector(
    (state) => state.queueNew
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedMonth && selectedYear) {
      const monthParam = `${selectedYear}-${selectedMonth}`;
      dispatch(getMonthlyReport(monthParam));
    }
  };

  const formatSecondsToTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <Card className='mb-2'>
      <Card.Header className="p-3">
        <div className="d-flex flex-column">
          <h5 className="mb-3">Laporan Bulanan Antrian</h5>
          <Form onSubmit={handleSubmit}>
            <Row className="g-2">
              <Col xs={12} md="auto" className="d-flex gap-2">
                <Form.Group controlId="bulan">
                  <Form.Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    required
                    style={{fontSize: 12}}
                  >
                    <option value="">-- Pilih Bulan --</option>
                    {bulanOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="tahun">
                  <Form.Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    required
                    style={{fontSize: 12}}
                  >
                    <option value="">-- Pilih Tahun --</option>
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col>
                <Button type="submit" variant="primary" style={{fontSize: 12}}>
                  {loadingMonthlyReport ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Mengambil...
                    </>
                  ) : (
                    'Ambil Laporan'
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Card.Header>

      <Card.Body>
        {errorMonthlyReport && (
          <Alert variant="danger" className="mt-3">
            {errorMonthlyReport}
          </Alert>
        )}

        {monthlyReport?.data?.users?.length > 0 && (
          <>
            <h6 className='fw-bold'>Rekap Operator</h6>
            <hr />
            {isMobile ? (
              // ✅ MOBILE VIEW
              <div className="d-flex flex-column gap-3">
                {monthlyReport.data.users.map((item, index) => (
                  <Card key={index} className="shadow-sm p-3">
                    <h6 className="fw-bold">{item.user}</h6>
                    <p className="mb-1"><strong>Email:</strong> {item.email}</p>
                    <p><strong>Total Dilayani:</strong> {item.total_dilayani}</p>

                    <hr />

                    {item.report.map((rpt, i) => (
                      <div key={i} className="mb-3">
                        <p className="mb-1"><strong>{rpt.jenis}</strong></p>
                        <p className="mb-1">Total: {rpt.total}</p>
                        <p className="mb-1">Total Waktu: {formatSecondsToTime(rpt.total_time)}</p>
                        <p>Rata-rata Waktu: {formatSecondsToTime(rpt.rata_rata)}</p>
                      </div>
                    ))}
                  </Card>
                ))}
              </div>
            ) : (
              // ✅ DESKTOP VIEW
              <>
                <Table striped bordered hover responsive size='sm' style={{ fontSize: 12 }} className='mb-5'>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nama</th>
                      <th>Email</th>
                      <th>Total Dilayani</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyReport.data.users.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.user}</td>
                        <td>{item.email}</td>
                        <td>{item.total_dilayani}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <h6 className='fw-bold'>Detail Layanan per Operator</h6>
                <hr />
                {monthlyReport.data.users.map((item, index) => (
                  <div key={index} className="mb-3">
                    <h6 className="mb-2">{item.user}</h6>
                    <Table striped bordered hover responsive size='sm' style={{ fontSize: 12 }}>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Jenis Layanan</th>
                          <th>Total Customer</th>
                          <th>Total Waktu</th>
                          <th>Rata-rata Waktu</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.report.map((reportItem, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{reportItem.jenis}</td>
                            <td>{reportItem.total}</td>
                            <td>{formatSecondsToTime(reportItem.total_time)}</td>
                            <td>{formatSecondsToTime(reportItem.rata_rata)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default MonthlyReport;
