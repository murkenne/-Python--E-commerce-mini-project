from flask import Blueprint, request, jsonify
from models import CustomerAccount, Customer
from database import db
from schemas import customer_account_schema, customers_account_schema

customer_account_bp = Blueprint('customer_account_bp', __name__)


# Create a new customer account
@customer_account_bp.route('/', methods=['POST'])
def add_customer_account():
    data = request.json
    new_account = CustomerAccount(
        username=data['username'],
        password=data['password'],  # Store password directly for now (no hashing)
        customer_id=data['customer_id']
    )
    db.session.add(new_account)
    db.session.commit()
    return customer_account_schema.jsonify(new_account), 201

# Get a customer account by ID
@customer_account_bp.route('/<int:id>', methods=['GET'])
def get_customer_account(id):
    account = CustomerAccount.query.get_or_404(id)
    return customer_account_schema.jsonify(account)

# Update a customer account
@customer_account_bp.route('/<int:id>', methods=['PUT'])
def update_customer_account(id):
    account = CustomerAccount.query.get_or_404(id)
    data = request.json
    account.username = data.get('username', account.username)
    account.password = data.get('password', account.password)
    db.session.commit()
    return customer_account_schema.jsonify(account)

# Delete a customer account
@customer_account_bp.route('/<int:id>', methods=['DELETE'])
def delete_customer_account(id):
    account = CustomerAccount.query.get_or_404(id)
    db.session.delete(account)
    db.session.commit()
    return jsonify({'message': 'Customer account deleted'}), 204

