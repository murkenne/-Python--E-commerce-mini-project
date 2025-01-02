from database import db
from datetime import datetime

# ✅ **Customer Model**
class Customer(db.Model):
    __tablename__ = 'customers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    phone = db.Column(db.String(20))  # Matches MySQL phone column
    
    # Relationships
    account = db.relationship(
        'CustomerAccount', 
        back_populates='customer', 
        uselist=False, 
        cascade='all, delete-orphan'
    )
    orders = db.relationship(
        'Order', 
        back_populates='customer', 
        lazy='dynamic', 
        cascade='all, delete-orphan'
    )
    
    def __repr__(self):
        return f"<Customer {self.name} - {self.email}>"


# ✅ **CustomerAccount Model**
class CustomerAccount(db.Model):
    __tablename__ = 'customer_accounts'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    
    # Relationship
    customer = db.relationship('Customer', back_populates='account')
    
    def __repr__(self):
        return f"<CustomerAccount {self.username}>"


# ✅ **Product Model**
class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, default=1)
    
    def __repr__(self):
        return f"<Product {self.name} - ${self.price}>"


# ✅ **Order Model**
class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    order_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    
    # Relationships
    customer = db.relationship('Customer', back_populates='orders')
    order_items = db.relationship(
        'OrderItem', 
        back_populates='order', 
        lazy='dynamic', 
        cascade='all, delete-orphan'
    )
    
    def __repr__(self):
        return f"<Order {self.id} - Customer {self.customer_id}>"


# ✅ **OrderItem Model**
class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id', ondelete='CASCADE'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    
    # Relationships
    order = db.relationship('Order', back_populates='order_items')
    product = db.relationship('Product')
    
    def __repr__(self):
        return f"<OrderItem Order:{self.order_id} Product:{self.product_id} Qty:{self.quantity}>"
    
    
