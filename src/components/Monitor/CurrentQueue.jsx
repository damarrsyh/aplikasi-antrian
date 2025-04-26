import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

const CurrentQueue = () => {
  const [calledQueue, setCalledQueue] = useState({
    queueIdentification: "",
    number: "",
    counter: "",
  });

  const [isPlayingAudio, setIsPlayingAudio] = useState(false); // Menandakan apakah audio sedang diputar

  // Fungsi untuk memutar audio satu per satu dalam array
  const playQueueAudio = async (audioList) => {
    setIsPlayingAudio(true); // Menandakan audio mulai diputar
    console.log("🔊 Memulai grup audio...");

    // Memutar audio satu per satu dalam urutan yang benar
    for (let audioUrl of audioList) {
      console.log(`🎵 Memutar audio: ${audioUrl}`);
      await new Promise((resolve) => {
        const audio = new Audio(audioUrl);
        audio.onended = resolve; // Setelah selesai, resolve untuk lanjut ke audio berikutnya
        audio.onerror = resolve; // Jika ada error, resolve agar tidak stuck
        audio.play();
      });
    }

    console.log("🎵 Semua audio dalam grup selesai diputar.");
    setIsPlayingAudio(false); // Menandakan audio selesai diputar

    // Cek apakah ada audio yang tersisa di localStorage
    const storedAudioList = JSON.parse(localStorage.getItem("audioQueue")) || [];
    if (storedAudioList.length > 0) {
      // Jika ada, ambil dan putar audio dari localStorage
      localStorage.removeItem("audioQueue"); // Hapus setelah diambil
      playQueueAudio(storedAudioList); // Mainkan audio dari localStorage
    }
  };

  // Fungsi untuk menambahkan audio baru ke dalam antrian
  const enqueueAudio = (audioList) => {
    console.log("⏳ Audio sedang berjalan, menambahkan ke localStorage");

    // Jika tidak ada audio yang sedang diputar, mulai memutar audio
    if (!isPlayingAudio) {
      console.log("🎶 Memulai pemutaran audio.");
      playQueueAudio(audioList);
    } else {
      // Simpan audio yang belum bisa diputar ke localStorage
      const storedAudioList = JSON.parse(localStorage.getItem("audioQueue")) || [];
      const newAudioList = [...storedAudioList, ...audioList];
      localStorage.setItem("audioQueue", JSON.stringify(newAudioList));
      console.log("📥 Menyimpan audio ke localStorage untuk pemutaran selanjutnya.");
    }
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

          // Set data antrian di state lokal
          setCalledQueue({ queueIdentification, number, counter });
        }

        if (audioList.length > 0) {
          enqueueAudio(audioList); // Tambahkan audio ke dalam queue
        }
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
  }, []); // WebSocket akan di-connect saat komponen pertama kali di-render

  return (
    <Card
      className="shadow flex-grow-1 text-center mb-2 border-primary-subtle"
      style={{
      }}
    >
      <Card.Body>
        <h1 className="fw-bold m-0" style={{ fontSize: 80 }}>
          {calledQueue?.queueIdentification || ""}
          {calledQueue?.number?.toString().padStart(3, "0") || "-"}
        </h1>
      </Card.Body>
      <Card.Footer className="bg-primary-subtle">
        <h3 className="fw-bold m-0">
          Loket {calledQueue?.counter || "-"}
        </h3>
      </Card.Footer>
    </Card>
  );
};

export default CurrentQueue;
