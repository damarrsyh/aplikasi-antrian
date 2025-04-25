import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { callQueue } from "../../api/queueNewApi";
import { Form, Card, Modal, Button } from "react-bootstrap";
import { FaBullhorn, FaCheckCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setCalledQueue } from "../../redux/Slice/queueCallSlice";
import { getQueueWait, getQueueLive } from "../../redux/Slice/queueNewSlice";

const QueueCall = () => {
  const dispatch = useDispatch();
  const { queueWait } = useSelector((state) => state.queueNew);
  const channelRef = useRef(new BroadcastChannel("queue_channel"));
  const [counter, setCounter] = useState("");
  const [type, setType] = useState("");
  const [queueNumber, setQueueNumber] = useState("");
  const [queueIdentification, setQueueIdentification] = useState("");
  const [showModal, setShowModal] = useState(false);

  const queueTypes = useMemo(() => [
    { id: "siap_print", label: "Print", kd_jenis_antrian: "J0001", kd_identifikasi: "P" },
    { id: "design", label: "Design/Edit/Kreatif", kd_jenis_antrian: "J0002", kd_identifikasi: "D" },
    { id: "fotocopy", label: "Fotocopy", kd_jenis_antrian: "J0003", kd_identifikasi: "F" },
    { id: "retur", label: "Retur Barang", kd_jenis_antrian: "J0004", kd_identifikasi: "R" },
    { id: "pick", label: "Online Pick Up", kd_jenis_antrian: "J0005", kd_identifikasi: "O" },
    { id: "tamu", label: "Tamu / Supplier", kd_jenis_antrian: "J0006", kd_identifikasi: "T" },
  ], []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setCounter(userData.counter || "");
    }
  }, []);

  useEffect(() => {
    dispatch(getQueueWait());
    dispatch(getQueueLive());
  }, [dispatch]);

  const handleServiceChange = (e) => {
    const selectedType = e.target.value;
    setType(selectedType);

    const selectedQueueType = queueTypes.find(type => type.id === selectedType);
    if (!selectedQueueType) {
      console.warn("Layanan tidak ditemukan:", selectedType);
      return;
    }
    
    const foundQueue = Array.isArray(queueWait?.data)
    ? queueWait.data
    .flatMap(item => item.list_menunggu ?? [])
    .find(queue => queue.kd_jenis_antrian === selectedQueueType.kd_jenis_antrian)
    : null;
    
    if (foundQueue) {
      setQueueNumber(foundQueue.nomor);
      setQueueIdentification(selectedQueueType.kd_identifikasi);
    } else {
        // Jika tidak ditemukan antrian, set nilai kosong
        setQueueIdentification("");
        setQueueNumber("");
      }
  };

  const handleCallQueue = useCallback(async () => {
    if (!counter || !type || !queueNumber) {
      alert("Harap pilih jenis layanan dan nomor antrian.");
      return;
    }
  
    try {
      const response = await callQueue(counter, type, queueNumber);
      console.log("Antrian Dipanggil:", response);
  
      dispatch(setCalledQueue({ 
        queueIdentification, 
        number: queueNumber, 
        counter
      }));
      channelRef.current.postMessage({ queueIdentification, number: queueNumber, counter });
      setShowModal(true);
  
      // Setelah 3 detik, tutup modal dan reload halaman
      setTimeout(() => {
        setShowModal(false);
        dispatch(getQueueWait());
        dispatch(getQueueLive());
      }, 3000);
  
      setType("");
      setQueueIdentification("");
      setQueueNumber("");
    } catch (error) {
      console.error("Gagal memanggil antrian:", error);
      alert("Gagal memanggil antrian. Silakan coba lagi.");
    }
  }, [counter, type, queueNumber, queueIdentification, dispatch]);
  

  return (
    <Card className="shadow-sm mb-3">
      <Card.Header className="d-flex bg-primary-subtle justify-content-between align-items-center">
        <span className="fw-bold">Loket: {counter}</span>
        <Form.Select
          value={type}
          onChange={handleServiceChange}
          className="custom-select"
        >
          <option value="">Pilih Layanan</option>
          {queueTypes.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </Form.Select>
      </Card.Header>
      <Card.Body className="d-flex flex-column gap-2">
        <div className="text-center py-3">
        <h1 className="fw-bold text-primary">
          {queueIdentification && queueNumber
            ? `${queueIdentification}${String(queueNumber).padStart(3, "0")}`
            : "-"}
        </h1>
        </div>

        <Button
          variant="primary"
          className="w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={handleCallQueue}
        >
          <FaBullhorn size={20} />
          Panggil
        </Button>
      </Card.Body>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body className="text-center py-4">
          <div className="mb-3">
            <FaCheckCircle className="text-success" size={50} />
          </div>
          <h5 className="mb-2">Antrian berhasil dipanggil</h5>
          <p className="text-muted mt-2 mb-0">Silakan layani customer di loket Anda.</p>
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default QueueCall;
