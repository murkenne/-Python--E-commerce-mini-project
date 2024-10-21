from flask import Blueprint, request, jsonify
from models import Product
from database import db
from schemas import product_schema, products_schema

product_bp = Blueprint('product_bp', __name__)

# Create a new product
@product_bp.route('/', methods=['POST'])
def add_product():
    data = request.json
    new_product = Product(
        name=data['name'],
        price=data['price'],
        stock=data.get('stock', 0)
    )
    db.session.add(new_product)
    db.session.commit()
    return product_schema.jsonify(new_product), 201

# List all products
@product_bp.route('/', methods=['GET'])
def get_products():
    products = Product.query.all()
    return products_schema.jsonify(products)

# Get a product by ID
@product_bp.route('/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    return product_schema.jsonify(product)

# Update a product
@product_bp.route('/<int:id>', methods=['PUT'])
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.json
    product.name = data.get('name', product.name)
    product.price = data.get('price', product.price)
    product.stock = data.get('stock', product.stock)
    db.session.commit()
    return product_schema.jsonify(product)

# Delete a product
@product_bp.route('/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted'}), 204
