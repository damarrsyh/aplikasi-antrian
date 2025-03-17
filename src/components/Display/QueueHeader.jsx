/* eslint-disable react/prop-types */

const QueueHeader = ({currentTime}) => {
  return (
    <div className="shadow mb-3 pt-3 ps-3 bg-primary text-white d-flex justify-content-between align-items-center position-relative" style={{ borderRadius: "10px" }}>
    <div className="flex-grow-1">
      <h4 className="fw-bold">PANDAWA24JAM</h4>
      <p>CS: 081234567891</p>
    </div>
    <div className="position-absolute top-50 end-0 translate-middle-y me-3">
      <h4 className="mb-0">{currentTime.toLocaleTimeString()}</h4>
    </div>
  </div>
  )
}

export default QueueHeader
