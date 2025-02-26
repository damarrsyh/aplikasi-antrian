import { Table, Button, Form, Pagination, InputGroup, FormControl } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { handleCall, toggleServiceStatus, handleDelete, handleEdit, useQueueData } from "./QueueActions";

// eslint-disable-next-line react/prop-types
const QueueTable = ({ showActions = true, reportView = false, settingsView = false, displayView = false, callQueueView = false }) => {
  
  const { currentItems, currentPage, totalPages, searchQuery, setSearchQuery, setCurrentPage, indexOfFirstItem } = useQueueData(settingsView, callQueueView);

  return (
    <>
      {(callQueueView || reportView || (!settingsView && !displayView)) && (
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <FormControl
            type="text"
            placeholder="Cari nama atau layanan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      )}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            {displayView ? (
              <>
                <th>Pengaturan Suara</th>
                <th>Video Komersil</th>
                <th className="text-center">Aksi</th>
              </>
            ) : settingsView ? (
              <>
                <th>Nama Layanan</th>
                <th>ID Layanan</th>
                <th>Status</th>
                <th className="text-center">Aksi</th>
              </>
            ) : reportView ? (
              <>
                <th>Nama</th>
                <th>No. Telepon</th>
                <th>Layanan</th>
                <th>Loket</th>
                <th>Cetak Antrian</th>
                <th>Selesai Antrian</th>
                <th className="text-center">Aksi</th>
              </>
            ) : (
              <>
                <th>Nama</th>
                <th>Layanan</th>
                <th>Kode Layanan</th>
                <th>Nomor Antrian</th>
                <th>Loket</th>
                <th>Status</th>
                {showActions && <th className="text-center">Aksi</th>}
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1 + indexOfFirstItem}</td>
              {displayView ? (
                <>
                  <td>
                    <Form.Select defaultValue={item.audio}>
                      <option>Default</option>
                      <option>Beep</option>
                      <option>Bell</option>
                    </Form.Select>
                  </td>
                  <td>{item.video}</td>
                  <td className="text-center">
                    <Button variant="info" size="sm" className="me-2">View</Button>
                    <Button variant="warning" size="sm" className="me-2">Edit</Button>
                    <Button variant="danger" size="sm">Hapus</Button>
                  </td>
                </>
              ) : settingsView ? (
                <>
                  <td>{item.service}</td>
                  <td>{item.serviceId}</td>
                  <td>{item.active ? "Aktif" : "Nonaktif"}</td>
                  <td className="text-center">
                    <Button variant={item.active ? "danger" : "success"} size="sm" onClick={() => toggleServiceStatus(item.id)}>
                      {item.active ? "Nonaktifkan" : "Aktifkan"}
                    </Button>
                  </td>
                </>
              ) : reportView ? (
                <>
                  <td>{item.name}</td>
                  <td>{item.phone}</td>
                  <td>{item.service}</td>
                  <td>{item.locket}</td>
                  <td>{item.startAt}</td>
                  <td>{item.completedAt}</td>
                  <td className="text-center">
                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(item.id)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>Hapus</Button>
                  </td>
                </>
              ) : (
                <>
                  <td>{item.name}</td>
                  <td>{item.service}</td>
                  <td>{item.serviceId}</td>
                  <td>{item.queueNumber}</td>
                  <td>{item.status === "Dilayani" ? item.locket : "-"}</td>
                  <td>{item.status}</td>
                  {showActions && (
                    <td className="text-center">
                      <Button variant={item.called ? "warning" : "primary"} size="sm" className="me-2" onClick={() => handleCall(item.id)}>
                        {item.called ? "Panggil Ulang" : "Panggil"}
                      </Button>
                      <Button variant="danger" size="sm">Hapus</Button>
                    </td>
                  )}
                </>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination className="justify-content-center">
        <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
      </Pagination>
    </>
  );
};

export default QueueTable;
