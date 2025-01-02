import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Toast, ToastContainer, Modal, Button, Card, Row, Col, Alert } from 'react-bootstrap';

const ProductList = ({ orderId }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [loggedInCustomer, setLoggedInCustomer] = useState(null);
  const [showToast, setShowToast] = useState(false); // For Toast Notification
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

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

      // Update stock
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { ...product, stock: product.stock - 1, status: 'Ordered' }
            : product
        )
      );

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

  // ✅ Fetch Product Details
  const handleViewProductDetails = async (productId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/products/${productId}`);
      setSelectedProduct(response.data);
      setShowProductModal(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
      setApiError('Failed to fetch product details. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Products</h1>
      {loggedInCustomer && (
        <Alert variant="info" className="text-center">
          Logged in as: <strong>{loggedInCustomer.name}</strong>
        </Alert>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      {apiError && <Alert variant="danger">{apiError}</Alert>}

      {/* ✅ Product Grid */}
      <Row xs={1} md={3} className="g-4">
        {products.map((product) => (
          <Col key={product.id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title
                  onClick={() => handleViewProductDetails(product.id)}
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {product.name}
                </Card.Title>
                <Card.Text>
                  <strong>Price:</strong> ${product.price} <br />
                  <strong>Stock:</strong> {product.stock}
                </Card.Text>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between">
                <Button variant="success" size="sm" onClick={() => handleAddToOrder(product.id)}>
                  Add to Order
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>
                  Delete
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ✅ Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Order Update</strong>
          </Toast.Header>
          <Toast.Body>Product successfully added to your order!</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* ✅ Product Details Modal */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct ? (
            <>
              <p><strong>Name:</strong> {selectedProduct.name}</p>
              <p><strong>Price:</strong> ${selectedProduct.price}</p>
              <p><strong>Stock:</strong> {selectedProduct.stock}</p>
            </>
          ) : (
            <p>Loading product details...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProductModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
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
