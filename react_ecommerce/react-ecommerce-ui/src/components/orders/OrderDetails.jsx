import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';

const OrderDetails = ({ orderId }) => {
  //console.log('Order ID:', orderId);

  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/orders/${orderId}`)
      .then(response => setOrderDetails(response.data))
      .catch(err => console.error('Error fetching order details:', err));
  }, [orderId]);

  if (!orderDetails) return <p>Loading...</p>;

  return (
    <div>
      <h3>Order Details</h3>
      <p><strong>Date:</strong> {orderDetails.date}</p>
      <p><strong>Status:</strong> {orderDetails.status}</p>
      <p><strong>Total:</strong> ${orderDetails.total}</p>
      <h4>Products:</h4>
      <ul>
        {orderDetails.items.map(item => (
          <li key={item.id}>
            {item.name} - {item.quantity} x ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

OrderDetails.propTypes = {
  orderId: PropTypes.number.isRequired,
};


export default OrderDetails;
 