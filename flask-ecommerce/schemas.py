from database import ma
from models import Customer, CustomerAccount, Product, Order, OrderItem
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields

# #List of models to generate schemas for
# models = [Customer, CustomerAccount, Product, Order, OrderItem]

# # Dictionary to store dynamically created schemas
# schemas = {}

# for model in models:
#     schema_name = f"{model.__name__}Schema"
#     many_schema_name = f"{model.__name__.lower()}s_schema"
    
#     # Dynamically create schema classes with proper Meta class
#     schema_class = type(
#         schema_name,
#         (SQLAlchemyAutoSchema,),  # Ensure ma.SQLAlchemyAutoSchema is valid
#         {
#             "Meta": type(
#                 "Meta",
#                 (),
#                 {
#                     "model": model,
#                     "load_instance": True
#                 }
#             )
#         }
#     )
    
#     # Instantiate single and many schemas
#     schemas[model.__name__.lower()] = schema_class()
#     schemas[model.__name__.lower() + 's'] = schema_class(many=True)

# Access schemas dynamically
# customer_schema = schemas['customer']
# customers_schema = schemas['customers']
# product_schema = schemas['product']
# products_schema = schemas['products']
# order_schema = schemas['order']
# orders_schema = schemas['orders']

from marshmallow import Schema, fields

# ✅ **Customer Schema**
class CustomerSchema(Schema):
    id = fields.Integer(dump_only=True)  # id is auto-generated, no need to be required on input
    name = fields.String(required=True)
    email = fields.String(required=True)
    phone = fields.String(required=False)
    
    class Meta:
        fields = ("id", "name", "email", "phone")


# ✅ **CustomerAccount Schema**
class CustomerAccountSchema(Schema):
    id = fields.Integer(dump_only=True)
    username = fields.String(required=True)
    password = fields.String(required=True, load_only=True)  # Security best practice
    customer_id = fields.Integer(required=True)
    
    class Meta:
        fields = ("id", "username", "password", "customer_id")


# ✅ **Product Schema**
class ProductSchema(Schema):
    id = fields.Integer(dump_only=True)
    name = fields.String(required=True)
    price = fields.Float(required=True)
    stock = fields.Integer(required=True)
    
    class Meta:
        fields = ("id", "name", "price", "stock")


# ✅ **Order Schema**
class OrderSchema(Schema):
    id = fields.Integer(dump_only=True)
    order_date = fields.DateTime(required=True)
    customer_id = fields.Integer(required=True)
    
    class Meta:
        fields = ("id", "order_date", "customer_id")


# ✅ **OrderItem Schema**
class OrderItemSchema(Schema):
    id = fields.Integer(dump_only=True)
    order_id = fields.Integer(required=True)
    product_id = fields.Integer(required=True)
    quantity = fields.Integer(required=True)
    
    class Meta:
        fields = ("id", "order_id", "product_id", "quantity")


# ✅ **Schema Instances**
customer_schema = CustomerSchema()
customers_schema = CustomerSchema(many=True)
customer_account_schema = CustomerAccountSchema()
customers_account_schema = CustomerAccountSchema(many=True)
product_schema = ProductSchema()
products_schema = ProductSchema(many=True)
order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)
order_item_schema = OrderItemSchema()
order_items_schema = OrderItemSchema(many=True)
