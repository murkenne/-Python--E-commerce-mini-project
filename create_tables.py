from app import app
from database import db

# Create tables in the database if they do not already exist
with app.app_context():
    db.create_all()
    print("Tables created successfully.")
