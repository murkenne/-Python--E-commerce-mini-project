import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Toast, ToastContainer } from 'react-bootstrap';

const ProductList = ({ orderId }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [loggedInCustomer, setLoggedInCustomer] = useState(null);
  const [showToast, setShowToast] = useState(false); // For Toast Notification

  // ✅ Fetch Logged-in Customer from localStorage
  useEffect(() => {
    const customerData = localStorage.getItem('loggedInCustomer');
    if (customerData) {
      setLoggedInCustomer(JSON.parse(customerData));
      console.log('Logged-in Customer:', JSON.parse(customerData));
    }
  }, []);

  // ✅ Fetch Products on Component Mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products. Please try again later.');
      }
    };

    fetchProducts();
  }, [orderId]);

  // ✅ Handle Add to Order History
  const handleAddToOrder = async (productId) => {
    if (!loggedInCustomer) {
      alert('No customer is logged in. Please log in first.');
      return;
    }

    try {
      await axios.post(
        `http://127.0.0.1:5000/orders/customer/${loggedInCustomer.id}`,
        { product_id: productId, quantity: 1 }
      );

      // ✅ Add Success Alert
      alert(`Product '${productId}' successfully added to your order.`);

      // Optionally: Update product state
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? { ...product, status: 'Ordered' } : product
        )
      );

      // ✅ Show Toast Notification
      setShowToast(true);
    } catch (error) {
      console.error('Error adding product to order:', error);
      setApiError('Failed to add product to order. Please try again later.');
    }
  };

  // ✅ Handle Delete Product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/products/${id}`);
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      setApiError('Failed to delete product. Please try again.');
    }
  };

  return (
    <div className="product-list">
      <h1>Products</h1>
      {loggedInCustomer && (
        <p>
          Logged in as: <strong>{loggedInCustomer.name}</strong>
        </p>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {apiError && <p style={{ color: 'red' }}>{apiError}</p>}
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} (ID: {product.id}) - ${product.price}
            <button
              onClick={() => handleAddToOrder(product.id)}
              style={{ marginLeft: '10px' }}
            >
              Add to Order
            </button>
            <button
              onClick={() => handleDelete(product.id)}
              style={{ marginLeft: '10px' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* ✅ Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Order Update</strong>
          </Toast.Header>
          <Toast.Body>Product successfully added to your order!</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

ProductList.propTypes = {
  orderId: PropTypes.number,
};

ProductList.defaultProps = {
  orderId: null,
};

export default ProductList;
