from flask import Blueprint, request, jsonify
from models import Customer
from database import db
from schemas import customer_schema, customers_schema

# Define the Blueprint for Customer Routes
customer_bp = Blueprint('customer_bp', __name__)

# ✅ **1. Create a New Customer**
@customer_bp.route('/', methods=['POST'])
def add_customer():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    # Validate required fields
    try:
        new_customer = Customer(
            name=data['name'],
            email=data['email'],
            phone=data['phone']
        )
        db.session.add(new_customer)
        db.session.commit()
        return jsonify(customer_schema.dump(new_customer)), 201
    except KeyError as e:
        return jsonify({"error": f"Missing field: {e.args[0]}"}), 400

# ✅ **2. Get All Customers**
@customer_bp.route('/', methods=['GET'])
def get_all_customers():
    customers = Customer.query.all()
    return jsonify(customers_schema.dump(customers)), 200

# ✅ **3. Get a Customer by ID**
@customer_bp.route('/<int:id>', methods=['GET'])
def get_customer(id):
    customer = Customer.query.get_or_404(id)
    return jsonify(customer_schema.dump(customer)), 200

# ✅ **4. Update a Customer**
@customer_bp.route('/<int:id>', methods=['PUT'])
def update_customer(id):
    customer = Customer.query.get_or_404(id)
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    # Update fields if provided
    customer.name = data.get('name', customer.name)
    customer.email = data.get('email', customer.email)
    customer.phone = data.get('phone', customer.phone)
    
    db.session.commit()
    return jsonify(customer_schema.dump(customer)), 200

# ✅ **5. Delete a Customer**
@customer_bp.route('/<int:id>', methods=['DELETE'])
def delete_customer(id):
    customer = Customer.query.get_or_404(id)
    db.session.delete(customer)
    db.session.commit()
    return jsonify({'message': f'Customer with ID {id} deleted'}), 200
