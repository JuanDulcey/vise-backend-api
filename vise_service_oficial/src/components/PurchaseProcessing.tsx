import React, { useState } from 'react';
import { ShoppingCart, DollarSign, Calendar, MapPin, User, CheckCircle, XCircle, Loader } from 'lucide-react';
import { Purchase, PurchaseResponse, COUNTRIES, CURRENCIES } from '../types';
import { processPurchase, getRegisteredClients } from '../services/api';

const PurchaseProcessing: React.FC = () => {
  const [formData, setFormData] = useState<Purchase>({
    clientId: 0,
    amount: 0,
    currency: 'USD',
    purchaseDate: new Date().toISOString().slice(0, 16),
    purchaseCountry: ''
  });
  
  const [response, setResponse] = useState<PurchaseResponse | null>(null);
  const [loading, setLoading] = useState(false);
  
  const registeredClients = getRegisteredClients();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const purchaseWithISODate = {
        ...formData,
        purchaseDate: new Date(formData.purchaseDate).toISOString()
      };
      const result = await processPurchase(purchaseWithISODate);
      setResponse(result);
    } catch (error) {
      console.error('Error processing purchase:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const resetForm = () => {
    setFormData({
      clientId: 0,
      amount: 0,
      currency: 'USD',
      purchaseDate: new Date().toISOString().slice(0, 16),
      purchaseCountry: ''
    });
    setResponse(null);
  };

  const selectedClient = registeredClients.find(client => client.clientId === formData.clientId);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <ShoppingCart className="w-6 h-6 mr-3" />
            Procesar Compra
          </h2>
          <p className="text-green-100 mt-2">Procesamiento de pagos con aplicación automática de beneficios</p>
        </div>

        <div className="p-6">
          {registeredClients.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">
                No hay clientes registrados. Registre un cliente primero para procesar compras.
              </p>
            </div>
          )}

          {response ? (
            <div className={`p-6 rounded-lg mb-6 ${
              response.status === 'Approved' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center mb-3">
                {response.status === 'Approved' ? (
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 mr-3" />
                )}
                <h3 className={`text-lg font-semibold ${
                  response.status === 'Approved' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {response.status === 'Approved' ? '¡Compra Aprobada!' : 'Compra Rechazada'}
                </h3>
              </div>
              
              {response.status === 'Approved' && response.purchase ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <p className="text-sm text-gray-600 mb-1">Monto Original</p>
                    <p className="text-xl font-bold text-gray-800">
                      ${response.purchase.originalAmount} {formData.currency}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <p className="text-sm text-gray-600 mb-1">Descuento Aplicado</p>
                    <p className="text-xl font-bold text-green-600">
                      -${response.purchase.discountApplied} {formData.currency}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Monto Final</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ${response.purchase.finalAmount} {formData.currency}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border md:col-span-2">
                    <p className="text-sm text-blue-600 mb-1">Beneficio Aplicado</p>
                    <p className="font-medium text-blue-800">{response.purchase.benefit}</p>
                  </div>
                </div>
              ) : (
                <p className="text-red-700">{response.error}</p>
              )}
              
              <button
                onClick={resetForm}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Procesar Nueva Compra
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flex items-center text-gray-700 font-medium mb-2">
                  <User className="w-4 h-4 mr-2" />
                  Cliente
                </label>
                <select
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleInputChange}
                  required
                  disabled={registeredClients.length === 0}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors disabled:bg-gray-100"
                >
                  <option value={0}>Seleccionar cliente</option>
                  {registeredClients.map(client => (
                    <option key={client.clientId} value={client.clientId}>
                      {client.name} - {client.cardType} (ID: {client.clientId})
                    </option>
                  ))}
                </select>
                {selectedClient && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>País de residencia:</strong> {selectedClient.country} | 
                      <strong> Tarjeta:</strong> {selectedClient.cardType}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Monto
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    min="0.01"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Ej: 150.00"
                  />
                </div>

                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    Moneda
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    {CURRENCIES.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Fecha de Compra
                  </label>
                  <input
                    type="datetime-local"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    País de Compra
                  </label>
                  <select
                    name="purchaseCountry"
                    value={formData.purchaseCountry}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="">Seleccionar país</option>
                    {COUNTRIES.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || registeredClients.length === 0}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Procesando Compra...
                  </>
                ) : (
                  'Procesar Compra'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseProcessing;