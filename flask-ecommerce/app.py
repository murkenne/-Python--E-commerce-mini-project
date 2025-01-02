#from flask import Flask
#from flask_cors import CORS
#from database import db, ma
#from routes.customer_routes import customer_bp
#from routes.product_routes import product_bp
#from routes.order_routes import order_bp
#from routes.customer_account_routes import customer_account_bp
#
## Initialize the Flask app
#app = Flask(__name__)
#
## App Configurations
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:Tekking58!@localhost/e_commerce_db'
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
#
## Initialize SQLAlchemy and Marshmallow with the app
#db.init_app(app)
#ma.init_app(app)
#
## Enable CORS
#CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
#
## Association Table for Many-to-Many Relationship (Order-Product)
#order_product = db.Table(
#    'Order_Product',
#    db.Column('order_id', db.ForeignKey('Order.id'), primary_key=True),
#    db.Column('product_id', db.ForeignKey('Product.id'), primary_key=True)
#)
#
## Register Blueprints
#app.register_blueprint(customer_bp, url_prefix='/customers')
#app.register_blueprint(product_bp, url_prefix='/products')
#app.register_blueprint(order_bp, url_prefix='/orders')
#app.register_blueprint(customer_account_bp, url_prefix='/customer_accounts')
#
## Welcome Route
#@app.route('/', methods=['GET'])
#def welcome():
#    return "Welcome to the E-commerce API", 200
#
## Run the application
#if __name__ == '__main__':
#    with app.app_context():
#        db.create_all()  # Ensure all database tables are created
#    app.run(debug=True)
#



from flask import Flask, request, make_response
from flask_cors import CORS
from database import db, ma
from routes.customer_routes import customer_bp
from routes.product_routes import product_bp
from routes.order_routes import order_bp
from routes.customer_account_routes import customer_account_bp

# Initialize the Flask app
app = Flask(__name__)

# ✅ App Configurations
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:Tekking58!@localhost/e_commerce_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# ✅ Initialize SQLAlchemy and Marshmallow with the app
db.init_app(app)
ma.init_app(app)

# ✅ Enable CORS Globally
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# ✅ Association Table for Many-to-Many Relationship (Order-Product)
order_product = db.Table(
    'Order_Product',
    db.Column('order_id', db.ForeignKey('Order.id'), primary_key=True),
    db.Column('product_id', db.ForeignKey('Product.id'), primary_key=True)
)

# ✅ Register Blueprints
app.register_blueprint(customer_bp, url_prefix='/customers')
app.register_blueprint(product_bp, url_prefix='/products')
app.register_blueprint(order_bp, url_prefix='/orders')
app.register_blueprint(customer_account_bp, url_prefix='/customer_accounts')

# ✅ Handle Preflight Requests Globally
@app.before_request
def handle_options_request():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response, 204

# ✅ Welcome Route
@app.route('/', methods=['GET'])
def welcome():
    return "Welcome to the E-commerce API", 200

# ✅ Test CORS Endpoint
@app.route('/test-cors', methods=['GET'])
def test_cors():
    return {"message": "CORS is working correctly"}, 200

# ✅ Run the application
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Ensure all database tables are created
    app.run(debug=True)
