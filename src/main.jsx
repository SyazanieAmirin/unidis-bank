import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import Login from './Pages/Login_Register/Login';
import Register from './Pages/Login_Register/Register';
import User_Dashboard from './Pages/User_Dashboard/User_Dashboard';
import AccountSummary from './Pages/Account_Summary/AccountSummary';

import Transfer from './Pages/Transfer/Transfer';
import BankTransfer from './Pages/Transfer/BankTransfer';
import DuitNow from './Pages/Transfer/DuitNow';
import BankTransferToOtherBanks from './Pages/Transfer/BankTransferToOtherBanks';
import WithdrawATMOnline from './Pages/Transfer/WithdrawATMOnline';

import Goals from './Pages/Goals/Goals';
import AddNewGoal from './Pages/Goals/AddNewGoal';

const routes = [
  { path: '/', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/user-dashboard', element: <User_Dashboard /> },
  { path: '/account-summary', element: <AccountSummary /> },
  { path: '/transfer', element: <Transfer /> },
  { path: '/transfer/bank-transfer', element: <BankTransfer /> },
  { path: '/transfer/duitnow', element: <DuitNow /> },
  { path: '/transfer/bank-transfer-to-other-banks', element: <BankTransferToOtherBanks /> },
  { path: '/transfer/withdraw-atm-online', element: <WithdrawATMOnline /> },
  { path: '/goals', element: <Goals /> },
  { path: '/goals/add-new-goal', element: <AddNewGoal /> }

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
