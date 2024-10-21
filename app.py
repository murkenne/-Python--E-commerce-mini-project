from flask import Flask
from database import db, ma
from routes.customer_routes import customer_bp
from routes.product_routes import product_bp
from routes.order_routes import order_bp
from routes.customer_account_routes import customer_account_bp

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:Tekking58!@localhost/e_commerce_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy and Marshmallow with the app
db.init_app(app)
ma.init_app(app)

# Register blueprints
app.register_blueprint(customer_bp, url_prefix='/customers')
app.register_blueprint(product_bp, url_prefix='/products')
app.register_blueprint(order_bp, url_prefix='/orders')
app.register_blueprint(customer_account_bp, url_prefix='/customer_accounts')

# Welcome message route
@app.route('/', methods=['GET'])
def welcome():
    return "Welcome to the E-commerce API", 200

if __name__ == '__main__':
    app.run(debug=True)
