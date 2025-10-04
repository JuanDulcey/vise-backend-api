import React, { useState } from 'react';
import { User, DollarSign, MapPin, CreditCard, Crown, CheckCircle, XCircle, Loader, UserPlus } from 'lucide-react';
import { Client, ClientResponse, CARD_TYPES, COUNTRIES } from '../types';
import { registerClient } from '../services/api';

const ClientRegistration: React.FC = () => {
  const [formData, setFormData] = useState<Client>({
    name: '',
    country: '',
    monthlyIncome: 0,
    viseClub: false,
    cardType: 'Classic'
  });
  
  const [response, setResponse] = useState<ClientResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await registerClient(formData);
      setResponse(result);
    } catch (error) {
      console.error('Error registering client:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? Number(value) : value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      country: '',
      monthlyIncome: 0,
      viseClub: false,
      cardType: 'Classic'
    });
    setResponse(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <UserPlus className="w-6 h-6 mr-3" />
            Registrar Nuevo Cliente
          </h2>
          <p className="text-blue-100 mt-2">Complete los datos para solicitar una tarjeta VISE</p>
        </div>

        <div className="p-6">
          {response ? (
            <div className={`p-6 rounded-lg mb-6 ${
              response.status === 'Registered' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center mb-3">
                {response.status === 'Registered' ? (
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 mr-3" />
                )}
                <h3 className={`text-lg font-semibold ${
                  response.status === 'Registered' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {response.status === 'Registered' ? '¡Registro Exitoso!' : 'Registro Rechazado'}
                </h3>
              </div>
              
              {response.status === 'Registered' ? (
                <div className="space-y-2">
                  <p className="text-green-700">
                    <strong>Cliente ID:</strong> {response.clientId}
                  </p>
                  <p className="text-green-700">
                    <strong>Nombre:</strong> {response.name}
                  </p>
                  <p className="text-green-700">
                    <strong>Tipo de Tarjeta:</strong> {response.cardType}
                  </p>
                  <p className="text-green-600 font-medium">{response.message}</p>
                </div>
              ) : (
                <p className="text-red-700">{response.error}</p>
              )}
              
              <button
                onClick={resetForm}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Registrar Otro Cliente
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <User className="w-4 h-4 mr-2" />
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Ej: John Doe"
                  />
                </div>

                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    País de Residencia
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Seleccionar país</option>
                    {COUNTRIES.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Ingreso Mensual (USD)
                  </label>
                  <input
                    type="number"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Ej: 1500"
                  />
                </div>

                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Tipo de Tarjeta
                  </label>
                  <select
                    name="cardType"
                    value={formData.cardType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {CARD_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="viseClub"
                  id="viseClub"
                  checked={formData.viseClub}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="viseClub" className="ml-3 flex items-center text-gray-700">
                  <Crown className="w-4 h-4 mr-2 text-yellow-500" />
                  Suscripción VISE CLUB activa
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  'Registrar Cliente'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientRegistration;