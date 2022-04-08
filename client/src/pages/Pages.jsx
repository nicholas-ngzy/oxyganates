import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Catalog from './Catalog';
import CatalogCategory from './CatalogCategory';
import Product from './Product';
import Cart from './Cart';
import Order from './Order';
import Forum from './Forum';
import Post from './Post';
import AdminDashboard from './AdminDashboard';
import ProductDashboard from './ProductDashboard';
import OrderDashboard from './OrderDashboard';
import NotFound from './NotFound';
import { useState } from 'react';
import jwt_decode from 'jwt-decode';

export default function Pages() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  let decoded = '';
  if (token) {
    decoded = jwt_decode(token);
  }
  return (
    <Routes>
      <Route path='/' element={token == '' ? <Login /> : decoded.isAdmin ? <AdminDashboard /> : <Catalog />}></Route>
      <Route path='/login' element={<Login setToken={setToken} />} />
      <Route path='/register' element={<Register />} />
      <Route path='/products' element={<CatalogCategory />} />
      <Route path='/products/:id' element={<Product />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/orders' element={<Order />} />
      <Route path='/posts' element={<Forum />} />
      <Route path='/posts/:id' element={<Post />} />
      <Route exact path='/admin' element={<AdminDashboard />} />
      <Route exact path='/admin/products' element={<ProductDashboard />} />
      <Route exact path='/admin/orders' element={<OrderDashboard />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}
