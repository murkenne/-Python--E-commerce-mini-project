import { useRef, useState } from 'react';
import { Form, Button, Container, Alert, ListGroup, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

const ProductForm = () => {
  const nameRef = useRef(null);
  const priceRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [apiError, setApiError] = useState(null);

  const validateForm = () => {
    const errors = {};
    const name = nameRef.current.value.trim();
    const price = parseFloat(priceRef.current.value);

    if (!name) errors.name = 'Product name is required';
    if (!price || price <= 0) errors.price = 'Price must be a positive number';

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    const name = nameRef.current.value.trim();
    const price = parseFloat(priceRef.current.value);

    try {
      const response = await axios.post('http://127.0.0.1:5000/products', {
        name,
        price,
        quantity: 1,
      });

      setProducts((prevProducts) => [...prevProducts, { ...response.data, quantity: response.data.quantity || 1 }]);
      nameRef.current.value = '';
      priceRef.current.value = '';
    } catch (error) {
      console.error('Error submitting product:', error);
      setApiError('Failed to add product. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/products/${id}`);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      setApiError('Failed to delete product. Please try again.');
    }
  };

  const handleQuantityChange = (id, delta) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, quantity: Math.max(1, product.quantity + delta) }
          : product
      )
    );
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm mb-4">
        <Card.Header>
          <h3 className="text-center">Add/Edit Product</h3>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="productName">
              <Form.Label>Product Name</Form.Label>
              <Form.Control type="text" placeholder="Enter product name" ref={nameRef} />
              {errors.name && <Alert variant="danger" className="mt-2">{errors.name}</Alert>}
            </Form.Group>

            <Form.Group controlId="productPrice" className="mt-3">
              <Form.Label>Product Price</Form.Label>
              <Form.Control type="number" placeholder="Enter product price" ref={priceRef} />
              {errors.price && <Alert variant="danger" className="mt-2">{errors.price}</Alert>}
            </Form.Group>

            <div className="d-grid gap-2 mt-4">
              <Button variant="primary" type="submit">Submit</Button>
            </div>
          </Form>
          {apiError && <Alert variant="danger" className="mt-3">{apiError}</Alert>}
        </Card.Body>
      </Card>

      <h3 className="mb-3">Product List</h3>
      {products.length === 0 ? (
        <Alert variant="info">No products added yet.</Alert>
      ) : (
        <ListGroup>
          {products.map((product) => (
            <ListGroup.Item key={product.id} className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{product.name}</strong> - ${product.price.toFixed(2)} - Quantity: {product.quantity}
              </div>
              <div>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleQuantityChange(product.id, 1)}
                  className="me-1"
                >
                  +
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleQuantityChange(product.id, -1)}
                  className="me-1"
                >
                  -
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
};

export default ProductForm;
