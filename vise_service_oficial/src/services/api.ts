import { Client, ClientResponse, Purchase, PurchaseResponse, CardType } from '../types';

const API_BASE_URL = 'http://localhost:8000'; // Ajusta según tu backend

// Simulación de la lógica de validación para desarrollo
const validateClientEligibility = (client: Client): { isValid: boolean; error?: string } => {
  const { monthlyIncome, viseClub, cardType, country } = client;
  
  switch (cardType) {
    case 'Classic':
      return { isValid: true };
    
    case 'Gold':
      if (monthlyIncome < 500) {
        return { isValid: false, error: 'Se requiere un ingreso mínimo de 500 USD mensuales para tarjeta Gold' };
      }
      return { isValid: true };
    
    case 'Platinum':
      if (monthlyIncome < 1000) {
        return { isValid: false, error: 'Se requiere un ingreso mínimo de 1000 USD mensuales para tarjeta Platinum' };
      }
      if (!viseClub) {
        return { isValid: false, error: 'El cliente no cumple con la suscripción VISE CLUB requerida para Platinum' };
      }
      return { isValid: true };
    
    case 'Black':
    case 'White':
      if (monthlyIncome < 2000) {
        return { isValid: false, error: `Se requiere un ingreso mínimo de 2000 USD mensuales para tarjeta ${cardType}` };
      }
      if (!viseClub) {
        return { isValid: false, error: `Se requiere la suscripción VISE CLUB para tarjeta ${cardType}` };
      }
      if (['China', 'Vietnam', 'India', 'Iran'].includes(country)) {
        return { isValid: false, error: `El cliente con tarjeta ${cardType} no puede residir en ${country}` };
      }
      return { isValid: true };
    
    default:
      return { isValid: false, error: 'Tipo de tarjeta no válido' };
  }
};

const calculateDiscount = (
  amount: number,
  cardType: CardType,
  purchaseDate: string,
  clientCountry: string,
  purchaseCountry: string
): { discountApplied: number; benefit: string } => {
  const date = new Date(purchaseDate);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  const isAbroad = clientCountry !== purchaseCountry;
  
  let discount = 0;
  let benefit = 'Sin descuento';
  
  switch (cardType) {
    case 'Classic':
      return { discountApplied: 0, benefit: 'Sin beneficios' };
    
    case 'Gold':
      // Lunes(1), Martes(2), Miércoles(3) - compras > 100 USD - 15%
      if ([1, 2, 3].includes(dayOfWeek) && amount > 100) {
        discount = amount * 0.15;
        benefit = 'Lunes-Miércoles - Descuento 15%';
      }
      break;
    
    case 'Platinum':
      // Lunes-Miércoles, compras > 100 USD - 20%
      if ([1, 2, 3].includes(dayOfWeek) && amount > 100) {
        discount = amount * 0.20;
        benefit = 'Lunes-Miércoles - Descuento 20%';
      }
      // Sábados(6), compras > 200 USD - 30%
      else if (dayOfWeek === 6 && amount > 200) {
        discount = amount * 0.30;
        benefit = 'Sábado - Descuento 30%';
      }
      // Compras en el exterior - 5%
      else if (isAbroad) {
        discount = amount * 0.05;
        benefit = 'Compra en el exterior - Descuento 5%';
      }
      break;
    
    case 'Black':
      // Lunes-Miércoles, compras > 100 USD - 25%
      if ([1, 2, 3].includes(dayOfWeek) && amount > 100) {
        discount = amount * 0.25;
        benefit = 'Lunes-Miércoles - Descuento 25%';
      }
      // Sábados, compras > 200 USD - 35%
      else if (dayOfWeek === 6 && amount > 200) {
        discount = amount * 0.35;
        benefit = 'Sábado - Descuento 35%';
      }
      // Compras en el exterior - 5%
      else if (isAbroad) {
        discount = amount * 0.05;
        benefit = 'Compra en el exterior - Descuento 5%';
      }
      break;
    
    case 'White':
      // Lunes-Viernes(1-5), compras > 100 USD - 25%
      if ([1, 2, 3, 4, 5].includes(dayOfWeek) && amount > 100) {
        discount = amount * 0.25;
        benefit = 'Lunes-Viernes - Descuento 25%';
      }
      // Sábado-Domingo(6,0), compras > 200 USD - 35%
      else if ([6, 0].includes(dayOfWeek) && amount > 200) {
        discount = amount * 0.35;
        benefit = 'Fin de semana - Descuento 35%';
      }
      // Compras en el exterior - 5%
      else if (isAbroad) {
        discount = amount * 0.05;
        benefit = 'Compra en el exterior - Descuento 5%';
      }
      break;
  }
  
  return { discountApplied: discount, benefit };
};

let clientIdCounter = 1;
const registeredClients: Map<number, Client & { clientId: number }> = new Map();

export const registerClient = async (client: Client): Promise<ClientResponse> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const validation = validateClientEligibility(client);
  
  if (!validation.isValid) {
    return {
      clientId: 0,
      name: client.name,
      cardType: client.cardType,
      status: 'Rejected',
      error: validation.error
    };
  }
  
  const clientId = clientIdCounter++;
  const registeredClient = { ...client, clientId };
  registeredClients.set(clientId, registeredClient);
  
  return {
    clientId,
    name: client.name,
    cardType: client.cardType,
    status: 'Registered',
    message: `Cliente apto para tarjeta ${client.cardType}`
  };
};

export const processPurchase = async (purchase: Purchase): Promise<PurchaseResponse> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const client = registeredClients.get(purchase.clientId);
  
  if (!client) {
    return {
      status: 'Rejected',
      error: 'Cliente no encontrado'
    };
  }
  
  // Validar restricciones específicas para compras
  if ((client.cardType === 'Black' || client.cardType === 'White') && 
      ['China', 'Vietnam', 'India', 'Iran'].includes(purchase.purchaseCountry)) {
    return {
      status: 'Rejected',
      error: `El cliente con tarjeta ${client.cardType} no puede realizar compras desde ${purchase.purchaseCountry}`
    };
  }
  
  const { discountApplied, benefit } = calculateDiscount(
    purchase.amount,
    client.cardType,
    purchase.purchaseDate,
    client.country,
    purchase.purchaseCountry
  );
  
  return {
    status: 'Approved',
    purchase: {
      clientId: purchase.clientId,
      originalAmount: purchase.amount,
      discountApplied: Math.round(discountApplied * 100) / 100,
      finalAmount: Math.round((purchase.amount - discountApplied) * 100) / 100,
      benefit
    }
  };
};

export const getRegisteredClients = (): (Client & { clientId: number })[] => {
  return Array.from(registeredClients.values());
};