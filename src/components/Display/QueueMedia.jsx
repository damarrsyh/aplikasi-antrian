/* eslint-disable react/prop-types */
import { Card, ListGroup } from "react-bootstrap"
import ReactPlayer from "react-player"

const QueueMedia = ({ showVideo, missedCustomers }) => {
  const videoUrl = localStorage.getItem("videoUrl") || "";
  const themeColor = localStorage.getItem("themeColor") || "#007bff";

  return (
    <>
    {showVideo ? (
      <div className="w-100 d-flex transition" style={{ borderRadius: "10px", overflow: "hidden", flexGrow: 1 }}>
        {videoUrl ? (
          <ReactPlayer url={videoUrl} controls width="100%" height="100%" className="react-player" />
        ) : (
          <span className="text-muted">Tidak ada video yang ditampilkan</span>
        )}  
      </div>
    ) : (
      <Card className="shadow flex-grow-1 transition" style={{ borderRadius: "10px", width: "100%", minHeight: "250px" }}>
        <Card.Header className="text-white" style={{backgroundColor: themeColor}}>
          <h3 className="fw-bold">CUSTOMER YANG TERLEWAT</h3>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            {missedCustomers.length > 0 ? (
              missedCustomers.map((c, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between flex-column">
                  <div className="d-flex justify-content-between">
                    <h5 className="fw-bold">{c.customer.nomor_antrian}</h5>
                    <h5 className="text-muted fw-bold">
                      {c.customer.status} - {c.created_at ? new Date(c.created_at).toLocaleTimeString() : "Waktu Tidak Diketahui"}
                    </h5>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <p className="text-muted">Tidak ada customer yang terlewat.</p>
            )}
          </ListGroup>
        </Card.Body>
      </Card>
    )}
    </>
  )
}

export default QueueMedia
