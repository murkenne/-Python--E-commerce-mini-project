import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Alert, Container, Modal } from 'react-bootstrap';

const CustomerForm = () => {
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch Customer Data if Editing
  useEffect(() => {
    if (id) {
      setIsEdit(true);
      setIsLoading(true);
      axios
        .get(`http://127.0.0.1:5000/customers/${id}`)
        .then((response) => {
          setCustomer(response.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Fetch Error:', err.response || err.message);
          setError('Failed to fetch customer details.');
          setIsLoading(false);
        });
    }
  }, [id]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  // Validate Form Fields
  const validateForm = () => {
    const errors = {};
    if (!customer.name.trim()) errors.name = 'Name is required';
    if (!customer.email.trim()) errors.email = 'Email is required';
    if (!customer.phone.trim()) errors.phone = 'Phone is required';
    return errors;
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    const apiUrl = id
      ? `http://127.0.0.1:5000/customers/${id}`
      : 'http://127.0.0.1:5000/customers';
    const httpMethod = id ? axios.put : axios.post;

    httpMethod(apiUrl, customer, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        setShowSuccessModal(true);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('API Error:', err.response || err.message);
        setError('Failed to save customer details.');
        setIsLoading(false);
      });
  };

  // Close Modal and Redirect
  const closeModal = () => {
    setShowSuccessModal(false);
    navigate('/customers');
  };

  return (
    <Container>
      <h3>{isEdit ? 'Edit Customer' : 'Add Customer'}</h3>

      {isLoading && <Alert variant="info">Submitting customer data...</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} className="customer-form-container">
        <Form.Group controlId="formGroupName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={customer.name}
            onChange={handleChange}
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formGroupEmail" className="mt-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={customer.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formGroupPhone" className="mt-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="tel"
            name="phone"
            value={customer.phone}
            onChange={handleChange}
            isInvalid={!!errors.phone}
          />
          <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
        </Form.Group>

        <div className="d-grid gap-2 mt-4">
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isEdit ? 'Update Customer' : 'Add Customer'}
          </Button>
        </div>
      </Form>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Success!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          The customer has been successfully {isEdit ? 'updated' : 'added'}.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

CustomerForm.propTypes = {
  id: PropTypes.string,
};

export default CustomerForm;
