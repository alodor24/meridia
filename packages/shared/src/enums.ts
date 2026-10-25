export const ACCOUNT_TYPES = ['cash', 'bank', 'credit_card', 'savings', 'investment', 'wallet'] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const TRANSACTION_TYPES = ['income', 'expense'] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const TRANSFERABLE_ACCOUNT_TYPES = ['cash', 'bank', 'wallet'] as const;

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  cash: 'Efectivo',
  bank: 'Banco',
  credit_card: 'Tarjeta de crédito',
  savings: 'Ahorro',
  investment: 'Inversión',
  wallet: 'Billetera virtual',
};
