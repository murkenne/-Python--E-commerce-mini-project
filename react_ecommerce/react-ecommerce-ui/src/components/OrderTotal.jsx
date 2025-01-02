import PropTypes from 'prop-types';

const OrderTotal = ({ items }) => {
  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="order-total">
      <h4>Order Total</h4>
      <p><strong>Total Amount:</strong> ${calculateTotal().toFixed(2)}</p>
    </div>
  );
};

OrderTotal.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default OrderTotal;
