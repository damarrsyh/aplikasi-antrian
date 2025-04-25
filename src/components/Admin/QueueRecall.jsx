import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getType } from "../../redux/Slice/queueNewSlice";
import { recallQueue } from "../../api/queueNewApi";
import { Card, Form, Button, Alert } from "react-bootstrap";

const normalizeQueueType = (rawName) => {
  const lower = rawName.toLowerCase();

  if (lower.includes("design") || lower.includes("edit") || lower.includes("kreatif")) return "design";
  if (lower.includes("fotocopy")) return "fotocopy";
  if (lower.includes("online")) return "pick";
  if (lower.includes("retur")) return "retur";
  if (lower.includes("tamu")) return "tamu";
  if (lower.includes("siap")) return "siap_print";

  return lower.replace(/\s+/g, "_");
};

const QueueRecall = () => {
  const dispatch = useDispatch();
  const { type } = useSelector((state) => state.queueNew);
  console.log(type);
  
  const [counter, setCounter] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedTypeData, setSelectedTypeData] = useState(null);
  const [nomor, setNomor] = useState("");
  const [message, setMessage] = useState({ text: "", variant: "" });

  useEffect(() => {
    dispatch(getType());

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setCounter(userData.counter || "");
    }
  }, [dispatch]);

  const handleTypeChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedType(selectedValue);

    const selectedData = type.find((item) => normalizeQueueType(item.jenis_antrian) === selectedValue);
    setSelectedTypeData(selectedData || null);
  };

  const handleRecall = async () => {
    if (!selectedTypeData) {
      setMessage({ text: "Pilih jenis layanan terlebih dahulu.", variant: "warning" });
      return;
    }

    try {
      const result = await recallQueue(counter, selectedTypeData.kd_identifikasi, nomor);

      if (result?.success) {
        setMessage({
          text: `Antrian ${selectedTypeData.kd_identifikasi}-${nomor} berhasil dipanggil ulang.`,
          variant: "success",
        });
      } else {
        setMessage({ text: "Gagal recall antrian. Coba lagi.", variant: "danger" });
      }
    } catch (error) {
      console.error("Gagal recall antrian:", error);
      setMessage({ text: "Terjadi kesalahan sistem.", variant: "danger" });
    }
  };

  return (
    <Card className="p-4 mx-auto mt-4 shadow" style={{ maxWidth: "500px" }}>
      <Card.Body>
        <Card.Title className="mb-3">Recall Antrian</Card.Title>

        {message.text && (
          <Alert variant={message.variant} onClose={() => setMessage({ text: "", variant: "" })} dismissible>
            {message.text}
          </Alert>
        )}

        <Form.Group className="mb-3" controlId="jenisLayanan">
          <Form.Label>Jenis Layanan</Form.Label>
          <Form.Select value={selectedType} onChange={handleTypeChange}>
            <option value="">Pilih Layanan</option>
            {type?.map((item) => (
              <option key={item.kd_jenis_antrian} value={normalizeQueueType(item.jenis_antrian)}>
                {item.jenis_antrian}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="nomorAntrian">
          <Form.Label>Nomor Antrian</Form.Label>
          <Form.Control
            type="number"
            placeholder="Masukkan nomor antrian"
            value={nomor}
            onChange={(e) => setNomor(e.target.value)}
          />
        </Form.Group>

        {selectedTypeData && (
          <div className="mb-3 text-muted">
            Preview: <strong>{selectedTypeData.kd_identifikasi}-{nomor}</strong>
          </div>
        )}

        <Button variant="primary" onClick={handleRecall} disabled={!selectedType || !nomor}>
          Panggil Ulang
        </Button>
      </Card.Body>
    </Card>
  );
};

export default QueueRecall;
