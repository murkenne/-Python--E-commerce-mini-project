import React from 'react';
import { Container, Row, Col, Image, Button, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function NotFound() {
  return (
    <Container fluid className="text-center d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: '#f8f9fa', color: '#343a40' }}>
      <Row className="w-100">
        <Col md={6} className="d-flex flex-column justify-content-center align-items-center">
          <h1 className="display-3">404 - Not Found</h1>
          <p className="lead">Oops! The page you're looking for doesn't exist.</p>
          <Nav.Link href="/" className="p-0">
            <Button variant="primary" size="lg" className="mt-3 shadow">
              Return to Home
            </Button>
          </Nav.Link>
        </Col>
        <Col md={6} className="d-flex justify-content-center align-items-center">
          <Image
            src="https://www.publicdomainpictures.net/pictures/380000/velka/error-message.jpg"
            alt="Page not found"
            fluid
            className="rounded shadow"
            style={{ maxHeight: '400px' }}
          />
        </Col>
      </Row>
    </Container>
  );
}
