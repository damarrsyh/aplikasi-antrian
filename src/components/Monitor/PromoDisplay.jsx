import ReactPlayer from "react-player"

const QueueMedia = () => {
  const videoUrl = localStorage.getItem("videoUrl") || "";

  return (
    <div
      className="w-100 d-flex justify-content-center align-items-center transition"
      style={{
        borderRadius: "10px",
        overflow: "hidden",
        flexGrow: 1,
        backgroundColor: "#f8f9fa",
        minHeight: "250px",
      }}
    >
      {videoUrl ? (
        <ReactPlayer
          url={videoUrl}
          controls
          width="100%"
          height="100%"
          className="react-player"
        />
      ) : (
        <img
          src="/assets/no-video.jpg"
          alt="Tidak ada video tersedia"
          style={{
            maxWidth: "100%",
            height: "auto",
            objectFit: "contain",
          }}
        />
      )}
    </div>
  )
}

export default QueueMedia
