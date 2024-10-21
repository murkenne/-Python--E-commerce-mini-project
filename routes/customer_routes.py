from flask import Blueprint, request, jsonify
from models import Customer, CustomerAccount
from database import db
from schemas import customer_schema, customers_schema, CustomerAccountSchema

customer_bp = Blueprint('customer_bp', __name__)

# Create a new customer
@customer_bp.route('/', methods=['POST'])
def add_customer():
    data = request.json
    new_customer = Customer(
        name=data['name'],
        email=data['email'],
        phone_number=data['phone_number']
    )
    db.session.add(new_customer)
    db.session.commit()
    return customer_schema.jsonify(new_customer), 201

# Get all customers (GET)
@customer_bp.route('/', methods=['GET'])
def get_all_customers():
    customers = Customer.query.all()
    return customers_schema.jsonify(customers)

# Get a customer by ID
@customer_bp.route('/<int:id>', methods=['GET'])
def get_customer(id):
    customer = Customer.query.get_or_404(id)
    return customer_schema.jsonify(customer)

# Update a customer
@customer_bp.route('/<int:id>', methods=['PUT'])
def update_customer(id):
    customer = Customer.query.get_or_404(id)
    data = request.json
    customer.name = data.get('name', customer.name)
    customer.email = data.get('email', customer.email)
    customer.phone_number = data.get('phone_number', customer.phone_number)
    db.session.commit()
    return customer_schema.jsonify(customer)

# Delete a customer
@customer_bp.route('/<int:id>', methods=['DELETE'])
def delete_customer(id):
    customer = Customer.query.get_or_404(id)
    db.session.delete(customer)
    db.session.commit()
    return jsonify({'message': 'Customer deleted'}), 204
