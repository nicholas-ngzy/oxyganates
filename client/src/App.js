import './App.css';
import Homepage from './components/Homepage';
import Login from './components/Login';
import Register from './components/Register';
import Catalog from './components/Catalog';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [token, setToken] = useState();
  const checkToken = localStorage.getItem('token');
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route exact path='/' element={<Catalog />}></Route>
          <Route exact path='/homepage' element={checkToken !== '' ? <Homepage /> : <Login />}></Route>
          <Route path='/login' element={<Login setToken={setToken} />}></Route>
          <Route path='/register' element={<Register />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
