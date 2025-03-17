/* eslint-disable react/prop-types */
import { Card, Col, Row } from "react-bootstrap";
import { FaPrint, FaPalette, FaFileAlt, FaUndo, FaTruck, FaUser } from "react-icons/fa";

const iconMap = {
  P: <FaPrint size={30} />, D: <FaPalette size={30} />, F: <FaFileAlt size={30} />, 
  R: <FaUndo size={30} />, O: <FaTruck size={30} />, T: <FaUser size={30} />
};

const ServiceSelection = ({ services, selectedService, handleServiceSelect, servicesStatus }) => {
  return (
    <Row className="flex-grow-1">
      {services.map(service => {
        const isActive = servicesStatus[service.id] ?? true;
        
        return (
          <Col key={service.id} md={6} className="my-2">
            <Card
              className={`h-100 shadow-sm rounded-3 service-card border position-relative ${
                selectedService?.id === service.id ? "border-primary text-primary bg-primary-subtle" : "border-secondary bg-light text-dark"
              }`}
              onClick={() => handleServiceSelect(service.id)}
            >
              <Card.Body 
              className="d-flex flex-column justify-content-center align-items-center"                       
              style={{
                filter: isActive ? "none" : "blur(1.5px)", // Blur jika nonaktif
                pointerEvents: isActive ? "auto" : "none" // Disable klik jika nonaktif
              }}>
                <div className={`p-4 rounded border ${selectedService?.id === service.id ? "border-primary text-primary bg-light" : "border-secondary text-dark"}`}>
                  {iconMap[service.kode] || <FaUser size={30} />}
                </div>
                <Card.Text className={`py-1 px-4 fw-semibold my-2 rounded-4 ${selectedService?.id === service.id ? "bg-info text-dark border border-primary" : "bg-light text-dark border border-secondary"}`}>
                  {service.nama}
                </Card.Text>
              </Card.Body>
              
              {/* Overlay jika layanan nonaktif */}
              {!isActive && (
                <>
                  <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 d-flex align-items-center justify-content-center text-center bg-dark bg-opacity-50 rounded-3">
                    <h3 className="text-danger fw-bold">Layanan <br/> Sedang Off</h3>
                  </div>
                </>
              )}
            </Card>
          </Col>
        );
      })}
    </Row>
  )
}

export default ServiceSelection
