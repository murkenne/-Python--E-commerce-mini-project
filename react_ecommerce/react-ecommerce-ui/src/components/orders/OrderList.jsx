import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Button, Alert, Container, Card, Row, Col } from 'react-bootstrap';

const OrderList = ({ customerId }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [error, setError] = useState(null);

  // ✅ Fetch Customer Details and Orders on Mount
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (customerId) {
        try {
          // Fetch customer details
          const customerResponse = await axios.get(`http://127.0.0.1:5000/customers/${customerId}`);
          setCustomerName(customerResponse.data.name);

          // Fetch customer orders
          const ordersResponse = await axios.get(`http://127.0.0.1:5000/orders/customer/${customerId}`);
          setOrders(ordersResponse.data);
        } catch (err) {
          console.error('Error fetching customer or orders:', err);
          setError('Failed to fetch customer details or orders. Please try again later.');
        }
      }
    };

    fetchCustomerData();
  }, [customerId]);

  // ✅ Fetch Order Details
  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/orders/${orderId}`);
      setOrderDetails(response.data);
      setSelectedOrderId(orderId);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to fetch order details.');
    }
  };

  // ✅ Delete Individual Order Item
  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/orders/${selectedOrderId}/items/${itemId}`);
      setOrderDetails((prevDetails) => ({
        ...prevDetails,
        items: prevDetails.items.filter((item) => item.id !== itemId),
      }));
    } catch (err) {
      console.error('Error deleting order item:', err);
      setError('Failed to delete order item. Please try again later.');
    }
  };

  return (
    <Container>
      <Card className="mt-4 shadow-sm">
        <Card.Header className="bg-primary text-white text-center">
          <h3>Order History for <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => fetchOrderDetails(null)}>{customerName}</span></h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Display Orders */}
          <h5>Orders List</h5>
          {orders.length > 0 ? (
            <ListGroup>
              {orders.map((order) => (
                <ListGroup.Item
                  key={order.id}
                  active={order.id === selectedOrderId}
                  onClick={() => fetchOrderDetails(order.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <Row>
                    <Col>
                      <strong>Order #{order.id}</strong> - Total: ${order.total}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <Alert variant="info">No orders available for this customer.</Alert>
          )}

          {/* Display Order Details */}
          {orderDetails && (
            <div className="mt-4">
              <h5>Order Details (ID: {orderDetails.id})</h5>
              <ListGroup>
                {orderDetails.items.map((item) => (
                  <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{item.product_name}</strong> - Quantity: {item.quantity} - Price: ${item.price}
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      Delete
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

OrderList.propTypes = {
  customerId: PropTypes.number.isRequired,
};

export default OrderList;
