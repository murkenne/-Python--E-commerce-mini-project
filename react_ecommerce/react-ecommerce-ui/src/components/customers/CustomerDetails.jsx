import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Alert, Spinner, ListGroup } from 'react-bootstrap';

const CustomerDetails = () => {
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const { id } = useParams(); // Get customer ID from URL
  const navigate = useNavigate();

  // ✅ Fetch Customer Details
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        console.log(`Fetching customer details for ID: ${id}`);
        const response = await axios.get(`http://127.0.0.1:5000/customers/${id}`);
        console.log('Customer Details:', response.data);
        setCustomer(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching customer details:', err);
        setError('Failed to fetch customer details. Please try again later.');
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  // ✅ Fetch Customer Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log(`Fetching orders for customer ID: ${id}`);
        const response = await axios.get(`http://127.0.0.1:5000/orders/customer/${id}`);
        console.log('Customer Orders:', response.data);
        setOrders(response.data.orders || []);
        setLoadingOrders(false);
      } catch (err) {
        console.error('Error fetching customer orders:', err);
        setError('Failed to fetch customer orders. Please try again later.');
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [id]);

  // ✅ Handle Customer Deletion
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`http://127.0.0.1:5000/customers/${id}`);
        navigate('/customers'); // Redirect to customer list after deletion
      } catch (err) {
        console.error('Error deleting customer:', err);
        setError('Failed to delete customer. Please try again.');
      }
    }
  };

  // ✅ Loading & Error States
  if (loading) return <Spinner animation="border" className="mt-4" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!customer) return <Alert variant="info">No customer details available.</Alert>;

  return (
    <div className="customer-details">
      {/* ✅ Customer Details Section */}
      <Card className="mb-4">
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

      {/* ✅ Customer Orders Section */}
      <Card>
        <Card.Header>
          <h4>Order History</h4>
        </Card.Header>
        <Card.Body>
          {loadingOrders ? (
            <Spinner animation="border" className="mt-2" />
          ) : orders.length === 0 ? (
            <Alert variant="info">No orders found for this customer.</Alert>
          ) : (
            <ListGroup>
              {orders.map((order) => (
                <ListGroup.Item key={order.id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Order ID:</strong> {order.id} <br />
                    <strong>Date:</strong> {order.order_date} <br />
                    <strong>Total Items:</strong> {order.items?.length || 0}
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    View Details
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default CustomerDetails;
