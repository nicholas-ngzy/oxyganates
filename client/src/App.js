import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Catalog from './components/customer/Catalog';
import Product from './components/customer/Product';
import ProductDashboard from './components/admin/ProductDashboard';
import OrderDashboard from './components/admin/OrderDashboard';
import CatalogCategory from './components/customer/CatalogCategory';
import Order from './components/customer/Order';
import Forum from './components/Forum';
import Post from './components/Post';
import jwt_decode from 'jwt-decode';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  let decoded = '';
  if (token) {
    decoded = jwt_decode(token);
  }

  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route
            path='/'
            element={token == '' ? <Login /> : decoded.isAdmin ? <ProductDashboard /> : <Catalog />}
          ></Route>
          <Route path='/login' element={<Login setToken={setToken} />} />
          <Route path='/register' element={<Register />} />
          <Route path='/products' element={<CatalogCategory />} />
          <Route path='/products/:id' element={<Product />} />
          <Route path='/orders' element={<Order />} />
          <Route path='/posts' element={<Forum />} />
          <Route path='/posts/:id' element={<Post />} />
          <Route exact path='/admin/products' element={<ProductDashboard />} />
          <Route exact path='/admin/orders' element={<OrderDashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
