import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Button, ListGroup, Alert, Spinner } from 'react-bootstrap';

class CustomerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      error: null,
      loading: true,
    };
  }

  // ✅ Fetch Customers on Component Mount
  componentDidMount() {
    this.fetchCustomers();
  }

  fetchCustomers = () => {
    axios.get('http://127.0.0.1:5000/customers')
      .then(response => {
        this.setState({ customers: response.data, loading: false });
      })
      .catch(error => {
        this.setState({ error: 'Error fetching customers.', loading: false });
        console.error('Error fetching data:', error);
      });
  };

  // ✅ Delete a Customer
  deleteCustomer = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      axios.delete(`http://127.0.0.1:5000/customers/${customerId}`)
        .then(() => {
          this.fetchCustomers(); // Refresh after deletion
        })
        .catch(error => {
          this.setState({ error: 'Error deleting customer.' });
          console.error("Error deleting customer:", error);
        });
    }
  };

  // ✅ Handle Customer Login
  handleCustomerLogin = (customer) => {
    localStorage.setItem('loggedInCustomer', JSON.stringify(customer));
    console.log(`Customer ${customer.name} logged in successfully!`);
    alert(`Customer ${customer.name} logged in successfully!`);
  };

  render() {
    const { customers, error, loading } = this.state;

    if (loading) {
      return <Spinner animation="border" className="mt-4" />;
    }

    return (
      <div className="customer-list">
        <h3>Customers</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        {customers.length === 0 ? (
          <Alert variant="info">No customers available.</Alert>
        ) : (
          <ListGroup>
            {customers.map((customer) => (
              <ListGroup.Item 
                key={customer.id} 
                className="d-flex justify-content-between align-items-center"
              >
                {/* ✅ Clickable Name Navigates to Details */}
                <Link 
                  to={`/customers/${customer.id}`} 
                  style={{ textDecoration: 'none', fontWeight: 'bold', color: '#007bff' }}
                >
                  {customer.name}
                </Link>
                
                {/* ✅ Action Buttons */}
                <div>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => this.handleCustomerLogin(customer)}
                    className="me-2"
                  >
                    Login
                  </Button>
                  <Button
                    variant="warning"
                    size="sm"
                    as={Link}
                    to={`/edit-customer/${customer.id}`}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => this.deleteCustomer(customer.id)}
                  >
                    Delete
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
    );
  }
}

CustomerList.propTypes = {
  onCustomerSelect: PropTypes.func,
};

export default CustomerList;
