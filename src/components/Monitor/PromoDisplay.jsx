const QueueMedia = () => {

  return (
    <div
      className="w-100 d-flex justify-content-center align-items-center transition"
      style={{
        borderRadius: "10px",
        overflow: "hidden",
        backgroundColor: "#c1e0f5",
        minHeight: "250px",
        maxHeight: "565px"
      }}
    >
      <img
        src="/assets/Print.gif"
        controls
        className="react-player"
      />
    </div>
  )
}

export default QueueMedia
