import { useState } from 'react';
import axios from 'axios';

const PlaceOrderForm = ({ customerId }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [error, setError] = useState(null);

  const handlePlaceOrder = () => {
    axios.post('http://127.0.0.1:5000/orders', {
      customerId,
      items: selectedProducts
    })
      .then(() => alert('Order placed successfully!'))
      .catch(err => setError('Failed to place order.'));
  };

  return (
    <div>
      <h3>Place Order</h3>
      <div>
        {/* Product selection logic */}
        <button onClick={handlePlaceOrder}>Submit Order</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PlaceOrderForm;
