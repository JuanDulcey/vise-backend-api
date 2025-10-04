import React from 'react';
import { CreditCard } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-3">
          <CreditCard className="w-8 h-8" />
          <div>
            <h1 className="text-3xl font-bold">VISE</h1>
            <p className="text-blue-100 text-sm">Payment Processing Platform</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;