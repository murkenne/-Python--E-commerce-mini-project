from flask import Blueprint, request, jsonify
from models import Order, OrderItem, Product, Customer
from database import db
from schemas import order_schema, orders_schema
from datetime import datetime

# ✅ Create Blueprint
order_bp = Blueprint('order_bp', __name__)

# ✅ Create a new order for a specific customer
@order_bp.route('/customer/<int:customer_id>', methods=['POST'])
def add_order_for_customer(customer_id):
    """Add a product directly to a customer's order history."""
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 415

    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)

    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400

    try:
        # Fetch the customer and product
        customer = Customer.query.get_or_404(customer_id)
        product = Product.query.get_or_404(product_id)

        if product.stock < quantity:
            return jsonify({"error": f"Not enough stock for product {product.name}"}), 400

        # Create a new order
        new_order = Order(customer_id=customer.id, order_date=datetime.utcnow())
        db.session.add(new_order)
        db.session.commit()

        # Add product to the order
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=product.id,
            quantity=quantity
        )
        db.session.add(order_item)
        product.stock -= quantity

        db.session.commit()
        return jsonify({"message": "Order placed successfully", "order_id": new_order.id}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"error": "Failed to place order. Please try again."}), 500


# ✅ Retrieve an order by ID
@order_bp.route('/<int:order_id>', methods=['GET'])
def get_order(order_id):
    """Fetch a specific order by ID."""
    try:
        order = Order.query.get_or_404(order_id)
        return order_schema.jsonify(order)
    except Exception as e:
        print(f"Error fetching order {order_id}: {e}")
        return jsonify({"error": f"Failed to fetch order. Error: {str(e)}"}), 500


# ✅ List all orders for a specific customer (Updated)
@order_bp.route('/customer/<int:customer_id>', methods=['GET'])
def get_orders_for_customer(customer_id):
    """Fetch all orders for a specific customer."""
    try:
        print(f"Fetching orders for customer_id: {customer_id}")
        orders = Order.query.filter_by(customer_id=customer_id).all()
        print(f"Orders fetched: {orders}")
        
        if not orders:
            return jsonify({"message": "No orders found for this customer"}), 404
        
        # Return a clean JSON response
        return jsonify({
            "customer_id": customer_id,
            "orders": [
                {
                    "id": order.id,
                    "order_date": order.order_date.strftime('%Y-%m-%d'),
                    "customer_id": order.customer_id
                }
                for order in orders
            ]
        }), 200
    except Exception as e:
        print(f"Error fetching orders for customer {customer_id}: {e}")
        return jsonify({"error": f"Failed to fetch orders. Error: {str(e)}"}), 500


# ✅ Cancel an order
@order_bp.route('/<int:order_id>/cancel', methods=['PUT'])
def cancel_order(order_id):
    """Cancel an order if it hasn't been processed or shipped."""
    try:
        order = Order.query.get_or_404(order_id)
        if getattr(order, 'order_status', None) not in ['Processed', 'Shipped']:
            db.session.delete(order)
            db.session.commit()
            return jsonify({'message': 'Order canceled successfully'}), 200
        else:
            return jsonify({'error': 'Cannot cancel an order that has already been processed or shipped'}), 400
    except Exception as e:
        print(f"Error canceling order {order_id}: {e}")
        return jsonify({"error": f"Failed to cancel order. Error: {str(e)}"}), 500


# ✅ Calculate total price for an order
@order_bp.route('/<int:order_id>/total', methods=['GET'])
def calculate_order_total(order_id):
    """Calculate the total price of an order."""
    try:
        order = Order.query.get_or_404(order_id)
        total = sum(item.product.price * item.quantity for item in order.order_items)
        return jsonify({'order_id': order_id, 'total_price': total}), 200
    except Exception as e:
        print(f"Error calculating total for order {order_id}: {e}")
        return jsonify({"error": f"Failed to calculate total. Error: {str(e)}"}), 500
