/* eslint-disable react/prop-types */
import { Card, ListGroup } from "react-bootstrap"
import ReactPlayer from "react-player"

const QueueMedia = ({ showVideo, missedCustomers }) => {
  return (
    <>
    {showVideo ? (
      <div className="w-100 d-flex transition" style={{ borderRadius: "10px", overflow: "hidden", flexGrow: 1 }}>
        <ReactPlayer url="https://www.youtube.com/watch?v=FaU8BkqmXzo" controls width="100%" height="100%" className="react-player" />
      </div>
    ) : (
      <Card className="shadow flex-grow-1 transition" style={{ borderRadius: "10px", width: "100%", minHeight: "250px" }}>
        <Card.Header className="bg-warning text-white">
          <h3 className="fw-bold">CUSTOMER YANG TERLEWAT</h3>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            {missedCustomers.length > 0 ? (
              missedCustomers.map((customer, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between flex-column">
                  <div className="d-flex justify-content-between">
                    <h5 className="fw-bold">{customer.customer.queue_number}</h5>
                    <h5 className="text-muted fw-bold">
                      {customer.status} - {customer.created_at ? new Date(customer.created_at).toLocaleTimeString() : "Waktu Tidak Diketahui"}
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
