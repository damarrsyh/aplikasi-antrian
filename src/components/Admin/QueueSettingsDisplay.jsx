import { useState, useEffect } from "react";
import { Row, Col, Form, Card } from "react-bootstrap";
import ReactPlayer from "react-player";

const QueueSettingsDisplay = () => {
  const [videoUrl, setVideoUrl] = useState(localStorage.getItem("videoUrl") || "");

  useEffect(() => {
    localStorage.setItem("videoUrl", videoUrl);
  }, [videoUrl]);

  return (
    <Card>
      <Card.Header>Pengaturan Video Komersial</Card.Header>
      <Card.Body>
        <Row>
          {/* Form Input */}
          <Col>
            <Form.Group>
              <Form.Label>URL Video Komersial :</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan URL Video (YouTube / direct link)"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <Form.Text className="text-muted">
                Kosongkan jika tidak ingin menampilkan video.
              </Form.Text>
            </Form.Group>
            <hr />
            <h6 className="mb-2">Preview Video :</h6>
            <div
              className="w-100"
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                backgroundColor: "#f8f9fa",
                minHeight: "350px",
              }}
            >
              {videoUrl ? (
                <ReactPlayer
                  url={videoUrl}
                  controls
                  width="100%"
                  className="react-player"
                />
              ) : (
                <img
                  src="/images/video-placeholder.gif"
                  alt="Tidak ada video"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
              )}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default QueueSettingsDisplay;
