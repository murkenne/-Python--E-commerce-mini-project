import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

function HomePage() {
  return (
    <>
      {/* === Hero Section Start === */}
      <header className="hero-section">
        <Container fluid className="hero-container text-center text-md-start">
          <Row className="align-items-center justify-content-center">
            
            {/* === Left Side: Hero Text === */}
            <Col md={6} className="hero-text">
              {/* TODO: Add a main headline */}
              <h1 className="display-4 fw-bold"> 
                Welcome to Our E-Commerce Store!
                {/* Example: "Welcome to Our E-Commerce Store!" */}
              </h1>
              
              {/* TODO: Add a subheading or slogan */}
              <p className="lead mt-3">
                Discover a world of amazing products delivered to your door.
                {/* Example: "Discover a world of amazing products delivered to your door." */}
              </p>
              
              {/* TODO: Add Call-to-Action Buttons */}
              <div className="hero-cta mt-4">
                <Button variant='primary' size='lg' href='/products'>Explore Now</Button>
                {/* Example Button */}
                {/* <Button variant="primary" size="lg" href="/products">Explore Now</Button> */}
                {/* Add more buttons if needed */}
              </div>
            </Col>

            {/* === Right Side: Hero Image === */}
            <Col md={6} className="hero-image text-center">
              {/* TODO: Replace with your image URL */}
                <img 
                  src="https://www.solutions4ecommerce.com/wp-content/uploads/2018/01/ECommerce_Illustration_.png" 
                  alt="Hero Image" 
                  className="img-fluid rounded shadow" 
                />
            </Col>

          </Row>
        </Container>
      </header>
      {/* === Hero Section End === */}

      {/* === Additional Section Example (Optional) === */}
      {/* TODO: Add another section below the hero if needed */}
      <section className="additional-section mt-5">
        <Container>
          <Row>
            <Col>
              <h2>Why Choose Us?</h2>
              <p>Because we have the best products and the best online interactive support.</p>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default HomePage;
