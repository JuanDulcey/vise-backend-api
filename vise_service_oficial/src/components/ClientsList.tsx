import React from 'react';
import { Users, CreditCard, MapPin, DollarSign, Crown } from 'lucide-react';
import { getRegisteredClients } from '../services/api';

const ClientsList: React.FC = () => {
  const clients = getRegisteredClients();

  const getCardTypeColor = (cardType: string) => {
    switch (cardType) {
      case 'Classic': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'Gold': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Platinum': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Black': return 'bg-gray-900 text-white border-gray-700';
      case 'White': return 'bg-gray-50 text-gray-900 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (clients.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Users className="w-6 h-6 mr-3" />
              Clientes Registrados
            </h2>
            <p className="text-purple-100 mt-2">Gestión de clientes y sus tarjetas VISE</p>
          </div>
          
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay clientes registrados</h3>
            <p className="text-gray-500">Registre su primer cliente para comenzar a procesar pagos</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Users className="w-6 h-6 mr-3" />
            Clientes Registrados
          </h2>
          <p className="text-purple-100 mt-2">
            Total de clientes: {clients.length}
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <div 
                key={client.clientId}
                className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{client.name}</h3>
                    <p className="text-sm text-gray-600">ID: {client.clientId}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getCardTypeColor(client.cardType)}`}>
                    {client.cardType}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-3 text-blue-500" />
                    <span className="text-sm">{client.country}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-3 text-green-500" />
                    <span className="text-sm">${client.monthlyIncome.toLocaleString()} USD/mes</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Crown className="w-4 h-4 mr-3 text-yellow-500" />
                    <span className="text-sm">
                      VISE CLUB: {client.viseClub ? 
                        <span className="text-green-600 font-medium">Activa</span> : 
                        <span className="text-red-600">Inactiva</span>
                      }
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <CreditCard className="w-4 h-4 mr-3 text-purple-500" />
                    <span className="text-sm">Tarjeta {client.cardType}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Estado</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-xs text-green-600 font-medium">Activo</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsList;