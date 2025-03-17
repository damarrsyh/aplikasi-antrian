import { Carousel } from "react-bootstrap";

const ServiceCarousel = () => {
  return (
    <Carousel className="d-flex my-2 align-items-center justify-content-center">
      {["c1.png", "c2.jpg", "c3.jpg"].map((image, index) => (
        <Carousel.Item key={index} interval={3000} className="rounded">
          <img className="img-fluid rounded" src={`/${image}`} alt={`Slide ${index + 1}`} />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ServiceCarousel;