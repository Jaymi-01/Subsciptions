export type Currency = 'NGN' | 'USD';

export type BillingCycle = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export type Category =
  | 'Entertainment'
  | 'Productivity'
  | 'Developer & Cloud'
  | 'Utilities'
  | 'Health & Fitness'
  | 'Education'
  | 'Other';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  billingCycle: BillingCycle;
  firstPaymentDate: string; // YYYY-MM-DD
  nextBillingDate: string; // YYYY-MM-DD
  category: Category;
  paymentMethod?: string; // e.g., "UBA Dollar Card", "GTBank", "Kuda"
  isTrial: boolean;
  trialEndDate?: string;
  isActive: boolean;
  reminderDaysBefore: number; // 0 (day of), 1, 2, 3, etc.
  notes?: string;
  cancelUrl?: string;
  color?: string;
  icon?: string;
  createdAt: string;
}

export interface AppSettings {
  usdToNgnRate: number; // e.g., 1550
  defaultCurrency: Currency;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark';
}

export interface CurrencyTotals {
  totalNgnDirect: number;
  totalUsdDirect: number;
  totalInNgn: number; // direct NGN + (direct USD * rate)
  annualInNgn: number;
}
