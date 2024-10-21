from flask import Blueprint, request, jsonify
from models import Order, OrderItem, Product, Customer
from database import db
from schemas import order_schema, orders_schema, OrderItemSchema

order_bp = Blueprint('order_bp', __name__)

# Create a new order
@order_bp.route('/', methods=['POST'])
def place_order():
    data = request.json
    customer_id = data['customer_id']
    order_date = data['order_date']
    products = data['products']  # List of product IDs and quantities, e.g., [{"product_id": 1, "quantity": 2}]

    # Create a new order for the customer
    new_order = Order(
        customer_id=customer_id,
        order_date=order_date
    )
    db.session.add(new_order)
    db.session.commit()

    # Add order items
    for item in products:
        product_id = item['product_id']
        quantity = item['quantity']
        product = Product.query.get_or_404(product_id)
        
        # Check stock before adding to order
        if product.stock < quantity:
            return jsonify({'error': f'Not enough stock for product {product.name}'}), 400
        
        # Create an OrderItem
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=product_id,
            quantity=quantity
        )
        db.session.add(order_item)

        # Reduce the stock of the product
        product.stock -= quantity
    
    db.session.commit()
    return order_schema.jsonify(new_order), 201

# Retrieve an order by ID
@order_bp.route('/<int:order_id>', methods=['GET'])
def get_order(order_id):
    order = Order.query.get_or_404(order_id)
    return order_schema.jsonify(order)

# List all orders for a specific customer
@order_bp.route('/customer/<int:customer_id>', methods=['GET'])
def get_orders_for_customer(customer_id):
    orders = Order.query.filter_by(customer_id=customer_id).all()
    return orders_schema.jsonify(orders)

# Cancel an order (Bonus Feature)
@order_bp.route('/<int:order_id>/cancel', methods=['PUT'])
def cancel_order(order_id):
    order = Order.query.get_or_404(order_id)
    # Only allow cancellation if order hasn't been processed or shipped
    # (Assuming we have an "order_status" attribute in Order model)
    if order.order_status not in ['Processed', 'Shipped']:
        db.session.delete(order)
        db.session.commit()
        return jsonify({'message': 'Order canceled successfully'}), 200
    else:
        return jsonify({'error': 'Cannot cancel an order that has already been processed or shipped'}), 400

# Calculate total price for an order (Bonus Feature)
@order_bp.route('/<int:order_id>/total', methods=['GET'])
def calculate_order_total(order_id):
    order = Order.query.get_or_404(order_id)
    total = sum(item.product.price * item.quantity for item in order.order_items)
    return jsonify({'order_id': order_id, 'total_price': total}), 200
