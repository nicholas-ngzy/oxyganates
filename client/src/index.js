import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { TokenProvider } from './context/TokenProvider';

ReactDOM.render(
  <React.StrictMode>
    <TokenProvider>
      <App />
    </TokenProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
