import { Container, Card, Button, Row, Col, Form, } from 'react-bootstrap';
import { useState } from 'react';
import ReactPlayer from 'react-player';

const services = [
  {id: "TSP1", name: "test1"},
  {id: "TSP2", name: "test2"},
  {id: "TSP3", name: "test3"},
  {id: "TSP4", name: "test4"},
  {id: "TSP5", name: "test5"},
  {id: "TSP6", name: "test6"}
];

const ServiceSelection = () => {

  const [selectedService, setSelectedService] = useState (null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [ticket, setTicket] = useState (null);

  const handleServiceSelect = (serviceId) => {
    setSelectedService(services.find(service => service.id === serviceId));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedService && name && phone) {
      const queueNumber = `${selectedService.id}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTicket = {
        number : queueNumber,
        serviceId : selectedService.id,
        service : selectedService.name,
        name,
        phone
      };
      setTicket(newTicket);
      setTimeout(() => window.print(), 500);
    }
  }

  return (
  <Container>
    {!ticket ? (
        <Row className='vh-100'>
          <Col md={6} className='d-flex flex-column'>
          <h3 className='my-4'>Pilih Layanan</h3>
            <Row className='flex-grow-1'>
              {services.map(service => {
                const isSelected = selectedService?.id === service.id;
                return (
                <Col key={service.id} md={6} className='mb-3'>
                  <Card className={`h-100 ${isSelected ? "bg-primary text-white border-primary shadow-sm" : "bg-light"}`}>
                    <Card.Body className='d-flex flex-column justify-content-between'>
                      <Card.Title className='text-center'>{service.name}</Card.Title>
                      <Button 
                        variant={isSelected ? "light" : "outline-primary"} 
                        onClick={() => handleServiceSelect(service.id)}>
                        {isSelected ? "Dipilih" : "Pilih Layanan"}
                        </Button>
                    </Card.Body>
                  </Card>
                </Col>
                )
              })}
            </Row>
          </Col>
            <Col md={6} className='d-flex flex-column'>
              <h3 className='my-4'>Masukan Data Diri</h3>
              <Card className='flex-grow-1'>
                <Card.Body className='d-flex flex-column'>
                  <Form onSubmit={handleSubmit} className='flex-grow-1 d-flex flex-column'>
                    <Form.Group className='mb-3' controlId='formName'>
                      <Form.Label>Nama</Form.Label>
                      <Form.Control 
                        type='text'
                        placeholder='@example: pandawa'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='formPhone'>
                      <Form.Label>No Telepon</Form.Label>
                      <Form.Control 
                        type='text'
                        placeholder='@example: 08xxxxxxxxxxx'
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Button variant='primary' type='submit'>Submit</Button>
                  </Form>
                </Card.Body>
              </Card>
              <div className='d-flex flex-grow-1 my-3'>
              <ReactPlayer 
              url="https://www.youtube.com/watch?v=FaU8BkqmXzo&pp=ygULc3RvY2sgdmlkZW8%3D" 
              controls 
              width="100%" 
              height="400px"
            />
              </div>
            </Col>
        </Row>
    ) : (
    <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="p-4 text-center" style={{ maxWidth: "400px", width: "100%" }}>
          <Card.Body>
            <Card.Title className="fw-bold fs-3">Tiket Antrian</Card.Title>
            <hr />
            <Card.Text className="fw-bold text-uppercase fs-2 bg-light p-3 rounded">
              {ticket.number}
            </Card.Text>
            <Card.Text>
              <strong>Layanan :</strong> {ticket.service}
            </Card.Text>
            <Card.Text>
              <strong>Nama :</strong> {ticket.name}
            </Card.Text>
            <Card.Text>
              <strong>No Telepon :</strong> {ticket.phone}
            </Card.Text>
            <Button variant="success" onClick={() => window.print()}>
              Cetak Tiket
            </Button>
          </Card.Body>
        </Card>
      </Container>
    )}
  </Container>
  )
}

export default ServiceSelection
