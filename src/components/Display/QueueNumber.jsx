/* eslint-disable react/prop-types */
import { Card } from "react-bootstrap"

const QueueNumber = ({currentQueue, queueList}) => {
  return (
    <>
    {queueList.length > 0 ? (
      <Card className="shadow flex-grow-1 text-center" style={{ borderRadius: "10px", width: "100%", minHeight: "250px" }}>
        <Card.Header className="bg-info text-white">
          <h3 className="fw-bold">NOMOR ANTRIAN</h3>
        </Card.Header>
        <Card.Body>
          <h1 className="display-3 fw-bold p-3">{currentQueue ? currentQueue.customer.queue_number : "-"}</h1>
        </Card.Body>
        <Card.Footer className="bg-info text-white">
          <h4 className="fw-bold">
            {currentQueue ? currentQueue.counter || "Tidak Diketahui" : "Tidak Ada Data"}
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
