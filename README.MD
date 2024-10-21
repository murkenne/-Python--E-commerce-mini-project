# How to Set Up and Run the E-commerce API

Follow these 10 steps to set up and run the E-commerce API:

```bash
# 1. Clone the repository and navigate into the project folder
git clone https://github.com/your-username/e_commerce.git
cd e_commerce

# 2. Set up a virtual environment
python -m venv env_commerce

# 3. Activate the virtual environment
# For Windows:
env_commerce\Scripts\activate
# For macOS/Linux:
source env_commerce/bin/activate

# 4. Install the required packages
pip install Flask Flask-SQLAlchemy Flask-Marshmallow mysql-connector-python

# 5. Create a MySQL database named 'e_commerce_db'
# Run this in your MySQL command line or Workbench:
CREATE DATABASE e_commerce_db;

# 6. Update the database URI in app.py with your MySQL credentials
# Example:
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:your_password@localhost/e_commerce_db'

# 7. Create the database tables using the script
python create_tables.py

# 8. Start the Flask server
python app.py

# 9. Access the API at the following base URL:
# http://127.0.0.1:5000/

# 10. Test API endpoints using Postman or your browser
# Example: To get all customers, use:
# GET http://127.0.0.1:5000/customers/
```
