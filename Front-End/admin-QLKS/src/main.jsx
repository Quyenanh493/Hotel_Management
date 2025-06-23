import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.scss'
import 'antd/dist/reset.css';
// Import để dọn dẹp cookie cũ
import './utils/cookieCleanup';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <App />
  </BrowserRouter>
);
