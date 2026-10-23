import {
  format,
  differenceInCalendarDays,
  parseISO,
  isToday,
  isTomorrow,
  addWeeks,
  addMonths,
  addYears,
} from 'date-fns';
import { BillingCycle, Currency, CurrencyTotals, Subscription } from '../types/subscription';

export const formatCurrency = (
  amount: number,
  currency: Currency,
  includeDecimals = currency === 'USD'
): string => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return currency === 'NGN' ? '₦0' : '$0.00';
  }

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(amount);

  return currency === 'NGN' ? `₦${formatted}` : `$${formatted}`;
};

export const getMonthlyEquivalent = (amount: number, cycle: BillingCycle): number => {
  if (!amount || isNaN(amount)) return 0;
  switch (cycle) {
    case 'weekly':
      return amount * (52 / 12);
    case 'monthly':
      return amount;
    case 'quarterly':
      return amount / 3;
    case 'yearly':
      return amount / 12;
    default:
      return amount;
  }
};

export const calculateTotals = (
  subscriptions: Subscription[] = [],
  usdToNgnRate: number = 1550
): CurrencyTotals => {
  let totalNgnDirect = 0;
  let totalUsdDirect = 0;

  if (!Array.isArray(subscriptions)) {
    return { totalNgnDirect: 0, totalUsdDirect: 0, totalInNgn: 0, annualInNgn: 0 };
  }

  subscriptions
    .filter((sub) => sub && sub.isActive)
    .forEach((sub) => {
      const monthlyAmount = getMonthlyEquivalent(sub.amount, sub.billingCycle);
      if (sub.currency === 'USD') {
        totalUsdDirect += monthlyAmount;
      } else {
        totalNgnDirect += monthlyAmount;
      }
    });

  const convertedUsdInNgn = totalUsdDirect * (usdToNgnRate || 1550);
  const totalInNgn = totalNgnDirect + convertedUsdInNgn;
  const annualInNgn = totalInNgn * 12;

  return {
    totalNgnDirect,
    totalUsdDirect,
    totalInNgn,
    annualInNgn,
  };
};

export const getDaysRemaining = (isoDateString?: string): number => {
  if (!isoDateString) return 0;
  try {
    const target = parseISO(isoDateString);
    const today = new Date();
    return differenceInCalendarDays(target, today);
  } catch {
    return 0;
  }
};

export const formatRenewalDate = (isoDateString?: string): string => {
  if (!isoDateString) return '';
  try {
    const date = parseISO(isoDateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';

    const days = getDaysRemaining(isoDateString);
    if (days > 0 && days <= 7) return `In ${days} days`;
    return format(date, 'MMM d, yyyy');
  } catch {
    return isoDateString || '';
  }
};

export const computeNextRenewal = (fromDate: Date, cycle: BillingCycle): Date => {
  switch (cycle) {
    case 'weekly':
      return addWeeks(fromDate, 1);
    case 'monthly':
      return addMonths(fromDate, 1);
    case 'quarterly':
      return addMonths(fromDate, 3);
    case 'yearly':
      return addYears(fromDate, 1);
  }
};
