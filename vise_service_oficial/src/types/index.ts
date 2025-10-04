export interface Client {
  clientId?: number;
  name: string;
  country: string;
  monthlyIncome: number;
  viseClub: boolean;
  cardType: CardType;
}

export interface ClientResponse {
  clientId: number;
  name: string;
  cardType: string;
  status: 'Registered' | 'Rejected';
  message?: string;
  error?: string;
}

export interface Purchase {
  clientId: number;
  amount: number;
  currency: string;
  purchaseDate: string;
  purchaseCountry: string;
}

export interface PurchaseResponse {
  status: 'Approved' | 'Rejected';
  purchase?: {
    clientId: number;
    originalAmount: number;
    discountApplied: number;
    finalAmount: number;
    benefit: string;
  };
  error?: string;
}

export type CardType = 'Classic' | 'Gold' | 'Platinum' | 'Black' | 'White';

export const CARD_TYPES: CardType[] = ['Classic', 'Gold', 'Platinum', 'Black', 'White'];

export const COUNTRIES = [
  'USA', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'UK', 'France', 'Germany', 
  'Spain', 'Italy', 'Japan', 'South Korea', 'Australia', 'China', 'Vietnam', 
  'India', 'Iran', 'Russia', 'South Africa', 'Egypt'
];

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF'];