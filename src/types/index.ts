export interface Company {
  id: string;
  name: string;
  siret: string;
  tva: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  signature?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  siret?: string;
  createdAt: Date;
}

export interface Prestation {
  id: string;
  name: string;
  description: string;
  price: number;
  hourlyRate: number;
  category: string;
  estimatedTime: number;
}

export interface DevisPrestation {
  prestationId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalHT: number;
  hourlyRate?: number;
  estimatedHours?: number;
}

export interface Devis {
  id: string;
  number: string;
  clientId: string;
  client: Client;
  companyId: string;
  company: Company;
  prestations: DevisPrestation[];
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  status: 'brouillon' | 'envoyé' | 'signé' | 'accepté' | 'refusé';
  createdAt: Date;
  validUntil: Date;
  notes?: string;
  signature?: string;
  signatureDate?: Date;
}