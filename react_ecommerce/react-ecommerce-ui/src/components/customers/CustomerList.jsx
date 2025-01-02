import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Button, ListGroup, Alert } from 'react-bootstrap';

class CustomerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      error: null,
    };
  }

  componentDidMount() {
    this.fetchCustomers();
  }

  fetchCustomers = () => {
    axios.get('http://127.0.0.1:5000/customers')
      .then(response => {
        this.setState({ customers: response.data });
      })
      .catch(error => {
        this.setState({ error: 'Error fetching customers.' });
        console.error('Error fetching data:', error);
      });
  };

  deleteCustomer = (customerId) => {
    axios.delete(`http://127.0.0.1:5000/customers/${customerId}`)
      .then(() => {
        this.fetchCustomers();
      })
      .catch(error => {
        this.setState({ error: 'Error deleting customer.' });
        console.error("Error deleting customer:", error);
      });
  };

  handleCustomerLogin = (customer) => {
    localStorage.setItem('loggedInCustomer', JSON.stringify(customer));
    console.log(`Customer ${customer.name} logged in successfully!`);
    alert(`Customer ${customer.name} logged in successfully!`);
  };

  render() {
    const { customers, error } = this.state;

    return (
      <div className="customer-list">
        <h3>Customers</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <ListGroup>
          {customers.map((customer) => (
            <ListGroup.Item key={customer.id} className="d-flex justify-content-between align-items-center">
              {/* ✅ Edit Customer by Clicking the Name */}
              <Link to={`/edit-customer/${customer.id}`} style={{ textDecoration: 'none', fontWeight: 'bold' }}>
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
      </div>
    );
  }
}

CustomerList.propTypes = {
  onCustomerSelect: PropTypes.func,
};

export default CustomerList;
