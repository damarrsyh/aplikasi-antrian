import { useState, useEffect, useMemo, useCallback } from "react";
import { callQueue, fetchQueueWait } from "../../api/queueNewApi";
import { playQueueAudio } from "../../utils/audio";
import { Form, Card, Modal, Button } from "react-bootstrap";
import { FaBullhorn } from "react-icons/fa";

const QueueCall = () => {
  const [counter, setCounter] = useState("");
  const [type, setType] = useState("");
  const [queueNumber, setQueueNumber] = useState("");
  const [queueList, setQueueList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [calledQueue, setCalledQueue] = useState("");

  const queueTypes = useMemo(() => [
    { id: "siap_print", label: "Print", kd_jenis_antrian: "J0001" },
    { id: "design", label: "Design/Edit/Kreatif", kd_jenis_antrian: "J0002" },
    { id: "fotocopy", label: "Fotocopy", kd_jenis_antrian: "J0003" },
    { id: "retur", label: "Retur Barang", kd_jenis_antrian: "J0004" },
    { id: "pick", label: "Online Pick Up", kd_jenis_antrian: "J0005" },
    { id: "tamu", label: "Tamu / Supplier", kd_jenis_antrian: "J0006" },
  ], []);

  // Ambil counter dari localStorage saat komponen dimuat
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setCounter(userData.counter || "");
    }
  }, []);

  // Fetch antrian yang sedang menunggu
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchQueueWait();
      // console.log("Data queue dari API:", response);
  
      if (response?.success) {
        setQueueList(response.data || []);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.4.141:3000/ws");
  
    socket.onopen = () => {
      console.log("✅ WebSocket connected (QueueCall)");
    };
  
    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
    
        // Pastikan data berupa array
        if (Array.isArray(data)) {
          const sequenceData = data.find(
            (item) => item.sequence && item.number
          );
    
          if (sequenceData) {
            await playQueueAudio(sequenceData.sequence); // Mainkan audio
    
            const displayText = `Nomor Antrian ${sequenceData.number} Silahkan ke Loket No ${sequenceData.counter || counter}`;
            setCalledQueue(displayText);
            setShowModal(true);
          } else {
            console.warn("🔍 Tidak ada item valid untuk diputar audionya.");
          }
        }
      } catch (err) {
        console.error("❌ WebSocket message error:", err);
      }
    };
  
    socket.onerror = (error) => {
      console.error("🚨 WebSocket error:", error);
    };
  
    socket.onclose = () => {
      console.log("🔌 WebSocket disconnected (QueueCall)");
    };
  
    return () => socket.close();
  }, [counter]);

  const handleServiceChange = (e) => {
    const selectedType = e.target.value;
    setType(selectedType); // Simpan ID jenis antrian yang dipilih
  
    // Temukan data queueType berdasarkan ID yang dipilih
    const selectedQueueType = queueTypes.find(type => type.id === selectedType);
    if (!selectedQueueType) {
      console.warn("Layanan tidak ditemukan di queueTypes:", selectedType);
      return;
    }
  
    // console.log("Layanan dipilih:", selectedType);
    // console.log("Kode jenis antrian:", selectedQueueType.kd_jenis_antrian);
    // console.log("Data queueListWait saat ini:", queueList);
  
    // Cari nomor antrian berdasarkan `kd_jenis_antrian`
    const foundQueue = queueList
      .flatMap(item => item.list_menunggu) // Ambil semua list menunggu
      .find(queue => queue.kd_jenis_antrian === selectedQueueType.kd_jenis_antrian);
  
    // console.log("Data queue yang cocok:", foundQueue);
  
    // Simpan nomor antrian yang ditemukan, atau tampilkan "Tidak ada antrian"
    setQueueNumber(foundQueue ? foundQueue.nomor : "Tidak ada antrian");
  };

  const handleCallQueue = useCallback(async () => {
    if (!counter || !type || !queueNumber) {
      alert("Harap pilih jenis layanan dan nomor antrian.");
      return;
    }

    try {
      const response = await callQueue(counter, type, queueNumber);
      console.log("Antrian Dipanggil:", response);


      setCalledQueue(`Nomor Antrian ${queueNumber} - ${type} Silahkan ke Loket No ${counter}`);
      setShowModal(true);

      // Reset form setelah pemanggilan
      setQueueNumber("");
      setType("");
    } catch (error) {
      console.error("Gagal memanggil antrian:", error);
      alert("Gagal memanggil antrian. Silakan coba lagi.");
    }
  }, [counter, type, queueNumber]);

  return (
    <Card className="shadow-sm">
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
        {/* Loket & Tipe Layanan */}

        {/* Nomor Antrian */}
        <div className="text-center py-3">
          <h1 className="fw-bold text-primary">{queueNumber || "--"}</h1>
        </div>

        {/* Tombol Panggil */}
        <Button variant="primary" className="w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleCallQueue}>
          <FaBullhorn size={20} />
          Panggil
        </Button>
      </Card.Body>

      {/* Modal Konfirmasi */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Antrian Dipanggil</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h5>Antrian yang dipanggil:</h5>
          <h3 className="fw-bold text-primary">{calledQueue}</h3>
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default QueueCall;
