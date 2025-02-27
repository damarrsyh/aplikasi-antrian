import { useState } from "react";
import { Card, Table, Button, Form, Pagination, InputGroup, FormControl, Modal } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { handleCall, useQueueData } from "./QueueActions";

// eslint-disable-next-line react/prop-types
const QueueTable = ({ settingsView = false, displayView = false }) => {
  const { currentItems, currentPage, totalPages, searchQuery, setSearchQuery, setCurrentPage, indexOfFirstItem } = useQueueData(settingsView);

  // State untuk modal
  const [showModal, setShowModal] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [selectedLocket, setSelectedLocket] = useState("");

  // Data loket operator (bisa diganti dengan API)
  const availableLockets = ["Loket 1", "Loket 2", "Loket 3", "Loket 4", "Loket 5", "Loket 6", "Loket 7", "Loket 8", "Loket 9"];

  // Fungsi membuka modal dan menyimpan antrian yang dipilih
  const handleOpenModal = (queue) => {
    setSelectedQueue(queue);
    setShowModal(true);
  };

  // Fungsi menutup modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedQueue(null);
    setSelectedLocket("");
  };

  // Fungsi memilih loket dan panggil antrian
  const handleSelectLocket = () => {
    if (selectedLocket) {
      handleCall(selectedQueue.id, selectedLocket); // Panggil dengan loket
      handleCloseModal(); // Tutup modal setelah memilih
    }
  };

  return (
    <>
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          {(!settingsView && !displayView) && (
            <InputGroup className="w-auto">
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
          <Pagination className="mb-0">
            <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
          </Pagination>
        </Card.Header>

        <Card.Body style={{ minHeight: "500px", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: "1", overflowY: "auto" }}>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nama</th>
                  <th>Layanan</th>
                  <th>Kode Layanan</th>
                  <th>Nomor Antrian</th>
                  <th>Pengambilan</th>
                  <th>Loket</th>
                  <th>Status</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1 + indexOfFirstItem}</td>
                    <td>{item.name}</td>
                    <td>{item.service}</td>
                    <td>{item.serviceId}</td>
                    <td>{item.queueNumber}</td>
                    <td>{item.startAt}</td>
                    <td>{item.status === "Dilayani" ? item.locket : "-"}</td>
                    <td>{item.status}</td>
                    <td className="text-center">
                      <Button variant="primary" size="sm" className="me-2" onClick={() => handleOpenModal(item)}>
                        Panggil
                      </Button>
                    </td>
                  </tr>
                ))}
                {Array.from({ length: Math.max(0, 10 - currentItems.length) }).map((_, index) => (
                  <tr key={`empty-${index}`} className="empty-row">
                    <td colSpan="9">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Modal untuk memilih loket */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Pilih Loket Operator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {availableLockets.map((locket, index) => (
              <Form.Check
                key={index}
                type="radio"
                label={locket}
                name="locket"
                value={locket}
                checked={selectedLocket === locket}
                onChange={(e) => setSelectedLocket(e.target.value)}
              />
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSelectLocket} disabled={!selectedLocket}>
            Panggil
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default QueueTable;
