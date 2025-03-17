/* eslint-disable react/prop-types */
import { Form, Button, Card } from "react-bootstrap";
import Select from "react-select";

const CustomerForm = ({ enableForm, setEnableForm, name, setName, phone, setPhone, countryCode, setCountryCode, countryCodes, handleSubmit }) => {

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minWidth: "120px",
      borderRadius: "5px",
      fontSize: "14px",
    }),
    option: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      fontSize: "14px",
    }),
    singleValue: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
    }),
  };

  return (
    <Card className={`flex-grow-1 shadow-sm rounded ${enableForm ? "border-primary" : "border-secondary border"}`}>
      <Card.Header className={`d-flex align-items-center ${enableForm ? "bg-primary" : ""}`}>
          <Form.Check
            type="checkbox"
            onChange={() => setEnableForm(!enableForm)}
            style={{ transform: "scale(2)" }}
            className="mx-2 me-3"
          />
          <h4 className={`mb-0 ${enableForm ? "text-white" : "text-muted"}`}>Option</h4>
      </Card.Header>
      <Card.Body className="d-flex flex-column">
        <Form onSubmit={handleSubmit} className="flex-grow-1">
        {enableForm && (
          <>
            <Form.Group className="mt-3">
              <Form.Label>Nama</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Your Name" />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>No Telepon</Form.Label>
              <div className="d-flex">
                {/* Dropdown dengan react-select */}
                <Select
                  value={countryCodes.find((c) => c.code === countryCode)}
                  onChange={(selected) => setCountryCode(selected.code)}
                  options={countryCodes}
                  getOptionLabel={(e) => (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {e.code}
                    </div>
                  )}
                  getOptionValue={(e) => e.code}
                  styles={customStyles}
                  isDisabled={!enableForm}
                />
                
                {/* Input nomor telepon */}
                <Form.Control
                  type="text"
                  placeholder="Enter Your Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!enableForm}
                  className="ms-2"
                  style={{ flex: 1 }}
                />
              </div>
            </Form.Group>
            <Button className="mt-3" variant="primary" type="submit" disabled={!enableForm}>Submit</Button>
          </>
        )}
      </Form>
    </Card.Body>
  </Card>
  )
}

export default CustomerForm
