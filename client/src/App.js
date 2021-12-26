import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Catalog from './components/customer/Catalog';
import Product from './components/customer/Product';
import ProductDashboard from './components/admin/ProductDashboard';
import CatalogCategory from './components/customer/CatalogCategory';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  return (
    <div className='App'>
      <Router>
        <Routes>
          {/* <Route exact path='/' element={<Catalog />}></Route> */}
          <Route exact path='/' element={token !== '' ? <Catalog /> : <Login />}></Route>
          <Route path='/login' element={<Login setToken={setToken} />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/products/:id' element={<Product />}></Route>
          <Route path='/categories/:id' element={<CatalogCategory />}></Route>
          <Route path='/orders'></Route>
          <Route path='/forum'></Route>
          <Route exact path='/admin/products' element={<ProductDashboard />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
