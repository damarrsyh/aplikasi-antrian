import { useEffect, useState, useRef } from "react";
import { Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { getQueueDone } from "../../redux/Slice/monitorSlice";

const CurrentQueue = () => {
  const dispatch = useDispatch();
  const [calledQueue, setCalledQueue] = useState({
    queueIdentification: "",
    number: "",
    counter: "",
  });

  const audioQueue = useRef([]); // UPDATE: pakai useRef untuk audio queue
  const isPlayingRef = useRef(false); // UPDATE: pakai useRef untuk playing status

  const playNextAudio = async () => {
    if (isPlayingRef.current || audioQueue.current.length === 0) {
      return; // sudah main atau tidak ada audio
    }

    isPlayingRef.current = true;
    const { url } = audioQueue.current.shift(); // ambil audio pertama dari queue
    const audio = new Audio(url);

    audio.onended = () => {
      isPlayingRef.current = false;
      playNextAudio(); // setelah selesai, lanjutkan
    };

    audio.onerror = () => {
      console.error("❌ Error saat memutar audio");
      isPlayingRef.current = false;
      playNextAudio(); // kalau error tetap lanjutkan
    };

    audio.play();
  };

  const handleNewAudio = (audioList) => {
    const newAudios = audioList.map((url, index) => ({
      id: `${Date.now()}-${index}`,
      url,
    }));

    audioQueue.current.push(...newAudios); // masukkan semua audio baru ke queue
    playNextAudio(); // mulai mainkan jika belum
  };

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📨 Diterima dari WebSocket:", data);

        const audioList = Array.isArray(data.audio) ? data.audio : [];
        const kode = Array.isArray(data.kode) ? data.kode : [];

        if (kode.length >= 3) {
          const queueIdentification = kode[0].toUpperCase();
          const number = kode[1].toString().padStart(3, "0");
          const counter = kode[2];

          setCalledQueue({ queueIdentification, number, counter });
        }

        if (audioList.length > 0) {
          handleNewAudio(audioList);
        }

        dispatch(getQueueDone());
      } catch (err) {
        console.error("❌ WebSocket message error:", err);
      }
    };

    socket.onerror = (error) => {
      console.error("🚨 WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("🔌 WebSocket disconnected");
    };

    return () => socket.close();
  }, []);

  return (
    <Card
      className="shadow text-center mb-2"
      style={{
        backgroundColor: '#c1e0f5',
        borderColor: '#c1e0f5'
      }}
    >
      <Card.Body>
        <h1 className="fw-bold m-0" style={{ fontSize: 80 }}>
          {calledQueue?.queueIdentification || ""}
          {calledQueue?.number?.toString().padStart(3, "0") || "-"}
        </h1>
      </Card.Body>
      <Card.Footer
        style={{
          backgroundColor: '#a3d2f2',
          borderTop: '1px solid #90c8ef'
        }}
      >
        <h3 className="fw-bold m-0">
          Loket {calledQueue?.counter || "-"}
        </h3>
      </Card.Footer>
    </Card>
  );
};

export default CurrentQueue;
