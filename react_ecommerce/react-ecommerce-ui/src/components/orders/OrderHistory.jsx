import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Form, Alert, Container, Card, Row, Col, Button } from 'react-bootstrap';

const OrderHistory = ({ customerId }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filter, setFilter] = useState({ status: '', date: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/customers/${customerId}/orders`);
        setOrders(response.data);
        setFilteredOrders(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching order history:', err);
        setError('Failed to fetch order history.');
      }
    };

    if (customerId) {
      fetchOrderHistory();
    }
  }, [customerId]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  useEffect(() => {
    let filtered = orders;

    if (filter.status) {
      filtered = filtered.filter((order) => order.status === filter.status);
    }

    if (filter.date) {
      filtered = filtered.filter((order) => order.date === filter.date);
    }

    setFilteredOrders(filtered);
  }, [filter, orders]);

  return (
    <Container className="mt-4">
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white text-center">
          <h3>Order History</h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Filter Section */}
          <Form className="mb-4">
            <Row>
              <Col md={6}>
                <Form.Group controlId="statusFilter">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    as="select"
                    name="status"
                    value={filter.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="dateFilter">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={filter.date}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>

          {/* Order List */}
          {filteredOrders.length > 0 ? (
            <ListGroup>
              {filteredOrders.map((order) => (
                <ListGroup.Item
                  key={order.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <Row className="w-100">
                    <Col md={8}>
                      <strong>Order ID:</strong> {order.id} <br />
                      <strong>Date:</strong> {order.date} <br />
                      <strong>Status:</strong> {order.status} <br />
                      <strong>Total:</strong> ${order.total.toFixed(2)}
                    </Col>
                    <Col md={4} className="d-flex justify-content-end align-items-center">
                      <Button variant="primary" size="sm" className="me-2">
                        View Details
                      </Button>
                      <Button variant="danger" size="sm">
                        Cancel Order
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <Alert variant="info" className="text-center">
              No orders match your criteria.
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

OrderHistory.propTypes = {
  customerId: PropTypes.number.isRequired,
};

export default OrderHistory;
