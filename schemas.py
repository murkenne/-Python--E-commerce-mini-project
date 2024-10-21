from database import ma
from models import Customer, CustomerAccount, Product, Order, OrderItem

class CustomerSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Customer

class CustomerAccountSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = CustomerAccount

class ProductSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Product

class OrderSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Order

class OrderItemSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = OrderItem

# Single and multiple object schemas
customer_schema = CustomerSchema()
customers_schema = CustomerSchema(many=True)
product_schema = ProductSchema()
products_schema = ProductSchema(many=True)
order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)
