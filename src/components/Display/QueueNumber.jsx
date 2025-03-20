/* eslint-disable react/prop-types */
import { Card } from "react-bootstrap"

const QueueNumber = ({currentQueue, queueList}) => {

  const themeColor = localStorage.getItem("themeColor") || "#007bff";
  const fontSize = localStorage.getItem("fontSize") || "16";
  const largeQueueNumber = JSON.parse(localStorage.getItem("largeQueueNumber")) ?? true;

  return (
    <>
    {queueList.length > 0 ? (
      <Card className="shadow flex-grow-1 text-center" style={{ borderRadius: "10px", width: "100%", minHeight: "250px" }}>
        <Card.Header style={{backgroundColor: themeColor, color: "white"}}>
          <h3 className="fw-bold" style={{fontSize: `${fontSize}px`}}>NOMOR ANTRIAN</h3>
        </Card.Header>
        <Card.Body>
          <h1 className="display-3 fw-bold p-3" style={{fontSize: largeQueueNumber ? "60px" : "30px"}}>{currentQueue ? currentQueue.customer.nomor_antrian : "-"}</h1>
        </Card.Body>
        <Card.Footer style={{backgroundColor: themeColor, color: "white"}}>
          <h4 className="fw-bold"  style={{fontSize: `${fontSize}px`}}>
            {currentQueue ? currentQueue.customer.counter || "Tidak Diketahui" : "Tidak Ada Data"}
          </h4>
        </Card.Footer>
      </Card>
    ) : (
      <p className="text-muted">Tidak ada antrian aktif</p>
    )}
    </>
  )
}

export default QueueNumber
