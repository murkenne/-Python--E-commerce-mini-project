import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Alert } from 'react-bootstrap';

const CustomerDetails = () => {
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch customer details
  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/customers/${id}`)
      .then(response => {
        setCustomer(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching customer details:', err);
        setError('Failed to fetch customer details.');
        setLoading(false);
      });
  }, [id]);

  // Handle customer deletion
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      axios.delete(`http://127.0.0.1:5000/customers/${id}`)
        .then(() => {
          navigate('/customers');
        })
        .catch(err => {
          console.error('Error deleting customer:', err);
          setError('Failed to delete customer.');
        });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!customer) return <p>No customer details available.</p>;

  return (
    <div className="customer-details">
      <Card>
        <Card.Header>
          <h3>Customer Details</h3>
        </Card.Header>
        <Card.Body>
          <p><strong>Name:</strong> {customer.name}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>Phone:</strong> {customer.phone}</p>
        </Card.Body>
        <Card.Footer>
          <Button variant="danger" onClick={handleDelete} className="me-2">
            Delete Customer
          </Button>
          <Button variant="secondary" onClick={() => navigate('/customers')}>
            Back to Customers List
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};

CustomerDetails.propTypes = {
  id: PropTypes.string,
};

export default CustomerDetails;
