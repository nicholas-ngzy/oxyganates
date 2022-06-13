import React, { Routes, Route } from 'react-router-dom';
import NavMenu from '../components/NavMenu';
import Login from './Login';
import Register from './Register';
import Catalog from './Catalog';
import Product from './Product';
import Cart from './Cart';
import Order from './Order';
import Forum from './Forum';
import Post from './Post';
import AdminDashboard from './AdminDashboard';
import ProductDashboard from './ProductDashboard';
import OrderDashboard from './OrderDashboard';
import NotFound from './NotFound';

export default function Pages() {
  return (
    <>
      <NavMenu />
      <Routes>
        <Route path='/' element={<Catalog />} />
        <Route path='products/:id' element={<Product />} />
        <Route path='cart' element={<Cart />} />
        <Route path='orders' element={<Order />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route path='posts' element={<Forum />} />
        <Route path='posts/:id' element={<Post />} />
        <Route path='admin'>
          <Route index element={<AdminDashboard />} />
          <Route path='products' element={<ProductDashboard />} />
          <Route path='orders' element={<OrderDashboard />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}
