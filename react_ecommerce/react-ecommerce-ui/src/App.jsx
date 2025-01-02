import { Routes, Route } from 'react-router-dom';
import "./AppStyles.css";
import HomePage from './components/HomePage';
import CustomerList from './components/Customers/CustomerList';
import CustomerForm from './components/Customers/CustomerForm';
import CustomerDetails from './components/Customers/CustomerDetails';
import ProductList from './components/Products/ProductList';
import ProductForm from './components/Products/ProductForm';
import OrderList from './components/Orders/OrderList';
import OrderDetails from './components/Orders/OrderDetails';
import OrderHistory from './components/Orders/OrderHistory';
import NotFound from './components/NotFound';
import NavigationBar from "./components/NavigationBar";

function App() {
  return (
    <div className="app-container">
      <NavigationBar />
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />
    
        
        {/* Customers */}
        <Route path="/add-customer" element={<CustomerForm />} />
        <Route path="/edit-customer/:id" element={<CustomerForm />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/customers/:id" element={<CustomerDetails />} />
        
        {/* Products */}
        <Route path="/add-product" element={<ProductForm />} />
        <Route path="/edit-product/:id" element={<ProductForm />} />
        <Route path="/products" element={<ProductList />} />
        
        {/* Orders */}
        <Route path="/orders" element={<OrderList />} />
        <Route path="/orders/:id" element={<OrderDetails orderId={123} />} />
        <Route path="/order-history" element={<OrderHistory />} />
        
        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
