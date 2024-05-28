import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import Login from './Pages/Login_Register/Login';
import Register from './Pages/Login_Register/Register';

const routes = [
  { path: '/', element: <Login /> },
  { path: '/register', element: <Register /> },

];

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  </BrowserRouter>
);
