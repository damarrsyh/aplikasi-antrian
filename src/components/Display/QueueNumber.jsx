import { useEffect } from "react";
import { Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setCalledQueue } from "../../redux/Slice/queueCallSlice";
import { playQueueAudio } from "../../utils/audio";

const QueueNumber = () => {
  const dispatch = useDispatch();

  const calledQueue = useSelector((state) => state.queueCall.calledQueue);

  useEffect(() => {
    const channel = new BroadcastChannel("queue_channel");

    channel.onmessage = (event) => {
      console.log("📡 Menerima queue dari BroadcastChannel:", event.data);
      dispatch(setCalledQueue(event.data));
    };
  }, [dispatch]);

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.4.138:3000");

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
    <Card className="shadow flex-grow-1 text-center mb-2" 
      style={{
        borderRadius: "8px",
        width: "100%",
        minHeight: "200px",
        border: "2px solid #FF6961",
      }}>
      <Card.Body>
        <h1 className="fw-semibold m-0" style={{fontSize: 80}}>
          {calledQueue?.queueIdentification || ""}{calledQueue?.number?.toString().padStart(3, "0") || "-"}
        </h1>
      </Card.Body>
      <Card.Footer style={{ backgroundColor: "#FF6961" }}>
        <h3 className="fw-bold m-0 text-white">
          Loket {calledQueue?.counter || "-"}
        </h3>
      </Card.Footer>
    </Card>
  );
};

export default QueueNumber;
