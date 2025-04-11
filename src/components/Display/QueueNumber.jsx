import { useEffect } from "react";
import { Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setCalledQueue } from "../../redux/Slice/queueCallSlice";
import { playQueueAudio } from "../../utils/audio";

const QueueNumber = () => {
  const dispatch = useDispatch();

  const calledQueue = useSelector((state) => state.queueCall.calledQueue);
  const themeColor = localStorage.getItem("themeColor") || "#007bff";
  const fontSize = localStorage.getItem("fontSize") || "16";
  const largeQueueNumber = JSON.parse(localStorage.getItem("largeQueueNumber")) ?? true;

  useEffect(() => {
    const channel = new BroadcastChannel("queue_channel");

    channel.onmessage = (event) => {
      console.log("📡 Menerima queue dari BroadcastChannel:", event.data);
      dispatch(setCalledQueue(event.data));
    };

    return () => {
      channel.close();
    };
  }, [dispatch]);

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.4.141:3000/ws");

    socket.onopen = () => {
      console.log("✅ WebSocket connected (QueueNumber)");
    };

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        let sequenceData = [];

        if (Array.isArray(data) && typeof data[0] === "string") {
          sequenceData = data;
        } else {
          const foundItem = data.find(
            (item) => Array.isArray(item.sequence) && item.sequence.length > 0
          );
          sequenceData = foundItem?.sequence || [];

          if (foundItem?.number && foundItem?.counter) {
            dispatch(setCalledQueue({ number: foundItem.number, counter: foundItem.counter }));
          }
        }

        if (sequenceData.length > 0) {
          await playQueueAudio(sequenceData);
        }
      } catch (err) {
        console.error("❌ WebSocket message error (QueueNumber):", err);
      }
    };

    socket.onerror = (error) => {
      console.error("🚨 WebSocket error (QueueNumber):", error);
    };

    socket.onclose = () => {
      console.log("🔌 WebSocket disconnected (QueueNumber)");
    };

    return () => socket.close();
  }, [dispatch]);

  return (
    <Card className="shadow flex-grow-1 text-center" style={{ borderRadius: "10px", width: "100%", minHeight: "250px" }}>
      <Card.Header className="d-flex justify-content-center" style={{ backgroundColor: themeColor, color: "white" }}>
        <h3 className="fw-bold" style={{ fontSize: `${fontSize}px` }}>NOMOR ANTRIAN</h3>
      </Card.Header>
      <Card.Body>
        <h1 className="display-3 fw-bold p-3" style={{ fontSize: largeQueueNumber ? "60px" : "30px" }}>
          {calledQueue?.number || "-"}
        </h1>
      </Card.Body>
      <Card.Footer style={{ backgroundColor: themeColor, color: "white" }}>
        <h4 className="fw-bold" style={{ fontSize: `${fontSize}px` }}>
          Loket {calledQueue?.counter || "-"}
        </h4>
      </Card.Footer>
    </Card>
  );
};

export default QueueNumber;
