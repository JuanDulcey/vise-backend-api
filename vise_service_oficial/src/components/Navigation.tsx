import React from 'react';
import { UserPlus, ShoppingCart, Users } from 'lucide-react';

interface NavigationProps {
  activeTab: 'register' | 'purchase' | 'clients';
  onTabChange: (tab: 'register' | 'purchase' | 'clients') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'register' as const, label: 'Registrar Cliente', icon: UserPlus },
    { id: 'purchase' as const, label: 'Procesar Compra', icon: ShoppingCart },
    { id: 'clients' as const, label: 'Clientes', icon: Users },
  ];

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors duration-200 ${
                activeTab === id
                  ? 'border-blue-600 text-blue-700 font-medium'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;