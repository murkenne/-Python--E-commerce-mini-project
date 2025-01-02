#
#from flask import Blueprint, request, jsonify
#from models import Product
#from database import db
#from schemas import product_schema, products_schema
#
#product_bp = Blueprint('product_bp', __name__)
#
## ✅ Create a new product
#@product_bp.route('/', methods=['POST'])
#def add_product():
#    try:
#        data = request.json
#        new_product = Product(
#            name=data['name'],
#            price=data['price'],
#            stock=data.get('stock', 1)
#        )
#        db.session.add(new_product)
#        db.session.commit()
#        
#        
#        return jsonify(product_schema.dump(new_product)), 201
#    except Exception as e:
#        print(f"Error adding product: {e}")
#        return jsonify({'error': 'Failed to add product'}), 500
#
## ✅ List all products
#@product_bp.route('/', methods=['GET'])
#def get_products():
#    try:
#        products = Product.query.all()
#        return jsonify(products_schema.dump(products)), 200
#    except Exception as e:
#        print(f"Error fetching products: {e}")
#        return jsonify({'error': 'Failed to fetch products'}), 500
#
## ✅ Get a product by ID
#@product_bp.route('/<int:id>', methods=['GET'])
#def get_product(id):
#    try:
#        product = Product.query.get_or_404(id)
#        return jsonify(product_schema.dump(product)), 200
#    except Exception as e:
#        print(f"Error fetching product with ID {id}: {e}")
#        return jsonify({'error': f'Failed to fetch product with ID {id}'}), 500
#
## ✅ Update a product
#@product_bp.route('/<int:id>', methods=['PUT'])
#def update_product(id):
#    try:
#        product = Product.query.get_or_404(id)
#        data = request.json
#        product.name = data.get('name', product.name)
#        product.price = data.get('price', product.price)
#        product.stock = data.get('stock', product.stock)
#        db.session.commit()
#        return jsonify(product_schema.dump(product)), 200
#    except Exception as e:
#        print(f"Error updating product with ID {id}: {e}")
#        return jsonify({'error': f'Failed to update product with ID {id}'}), 500
#
## ✅ Delete a product
#@product_bp.route('/<int:id>', methods=['DELETE'])
#def delete_product(id):
#    try:
#        product = Product.query.get_or_404(id)
#        db.session.delete(product)
#        db.session.commit()
#        return jsonify({'message': 'Product deleted'}), 204
#    except Exception as e:
#        print(f"Error deleting product with ID {id}: {e}")
#        return jsonify({'error': f'Failed to delete product with ID {id}'}), 500
#


from flask import Blueprint, request, jsonify
from models import Product
from database import db
from schemas import product_schema, products_schema

product_bp = Blueprint('product_bp', __name__)

# ✅ Create a new product
@product_bp.route('/', methods=['POST'])
def add_product():
    try:
        data = request.json
        new_product = Product(
            name=data['name'],
            price=data['price'],
            stock=data.get('quantity', 1)  # Default quantity to 1
        )
        db.session.add(new_product)
        db.session.commit()
        
        # Ensure the response uses `quantity` instead of `stock`
        response_data = product_schema.dump(new_product)
        response_data['quantity'] = response_data.pop('stock', 1)
        
        return jsonify(response_data), 201
    except Exception as e:
        print(f"Error adding product: {e}")
        return jsonify({'error': 'Failed to add product'}), 500


# ✅ List all products
@product_bp.route('/', methods=['GET'])
def get_products():
    try:
        products = Product.query.all()
        response_data = products_schema.dump(products)
        
        # Map stock -> quantity for each product
        for product in response_data:
            product['quantity'] = product.pop('stock', 1)
        
        return jsonify(response_data), 200
    except Exception as e:
        print(f"Error fetching products: {e}")
        return jsonify({'error': 'Failed to fetch products'}), 500


# ✅ Get a product by ID
@product_bp.route('/<int:id>', methods=['GET'])
def get_product(id):
    try:
        product = Product.query.get_or_404(id)
        response_data = product_schema.dump(product)
        response_data['quantity'] = response_data.pop('stock', 1)
        return jsonify(response_data), 200
    except Exception as e:
        print(f"Error fetching product with ID {id}: {e}")
        return jsonify({'error': f'Failed to fetch product with ID {id}'}), 500


# ✅ Update a product
@product_bp.route('/<int:id>', methods=['PUT'])
def update_product(id):
    try:
        product = Product.query.get_or_404(id)
        data = request.json
        
        product.name = data.get('name', product.name)
        product.price = data.get('price', product.price)
        product.stock = data.get('quantity', product.stock)  # Map `quantity` to `stock`
        
        db.session.commit()
        
        response_data = product_schema.dump(product)
        response_data['quantity'] = response_data.pop('stock', 1)
        
        return jsonify(response_data), 200
    except Exception as e:
        print(f"Error updating product with ID {id}: {e}")
        return jsonify({'error': f'Failed to update product with ID {id}'}), 500


# ✅ Delete a product
@product_bp.route('/<int:id>', methods=['DELETE'])
def delete_product(id):
    try:
        product = Product.query.get_or_404(id)
        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': 'Product deleted'}), 204
    except Exception as e:
        print(f"Error deleting product with ID {id}: {e}")
        return jsonify({'error': f'Failed to delete product with ID {id}'}), 500
