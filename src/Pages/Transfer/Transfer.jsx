import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Components/Global/Header';

const Transfer = () => {
  const transferOptions = [
    { id: 1, name: 'Bank Transfer (Unidis TO Unidis)', icon: '', link: '/transfer/bank-transfer' },
    { id: 2, name: 'DuitNow (QR)', icon: '', link: '/transfer/duitnow' },
    { id: 3, name: 'Bank Transfer (Unidis TO Other Banks)', icon: '', link: '/transfer/bank-transfer-to-other-banks' },
    { id: 4, name: 'Withdraw from ATM Online', icon: '', link: '/transfer/withdraw-atm-online' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center py-5">
      <Header current_page="Transfer" />
      <div className="w-full max-w-5xl p-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {transferOptions.map(option => (
            <Link to={option.link} key={option.id} className="flex flex-col items-center justify-center bg-black text-white rounded-lg p-10 h-64 transition-all hover:scale-95 cursor-pointer">
              <div className="text-5xl mb-4">{option.icon}</div>
              <div className="text-lg font-bold">{option.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transfer;
