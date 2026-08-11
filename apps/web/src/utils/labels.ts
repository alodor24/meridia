import { COUNTRIES, type AccountType } from '@meridia/shared';

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  cash: 'Efectivo',
  bank: 'Banco',
  credit_card: 'Tarjeta de crédito',
  savings: 'Ahorro',
  investment: 'Inversión',
};

export const ACCOUNT_TYPE_OPTIONS: Array<{ value: AccountType; label: string }> = Object.entries(
  ACCOUNT_TYPE_LABELS,
).map(([value, label]) => ({ value: value as AccountType, label }));

export function getCountryName(code: string): string {
  return COUNTRIES.find((c) => c.code === code.toUpperCase())?.name ?? code;
}

export function getCurrencyName(code: string): string {
  return code.toUpperCase();
}
