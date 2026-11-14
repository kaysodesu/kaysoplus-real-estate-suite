export interface ClientOutputs {
  luxury: string;
  first_time: string;
  social_thread: string;
  zillow_optimized: string;
  custom?: string;
  [key: string]: string | undefined;
}

export interface ClientRecord {
  id: string;
  name: string;
  property: string;
  subtitle: string;
  sqft: string;
  beds: string;
  features: string;
  tags?: string[];
  outputs: ClientOutputs;
  createdAt: string;
  updatedAt?: string;
}

export type FormulaKey = 'luxury' | 'first_time' | 'social_thread' | 'zillow_optimized' | 'custom';

export interface FormulaConfig {
  key: FormulaKey;
  label: string;
  iconName: string;
  badge: string;
  description: string;
  colorClass: string;
  accentBorder: string;
}
