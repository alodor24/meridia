import { describe, it, expect } from 'vitest';
import { formatCurrency, getCurrencySymbol, formatDate, formatMonth, today, startOfMonth } from './format';

describe('getCurrencySymbol', () => {
  it('returns the custom symbol for VES', () => {
    expect(getCurrencySymbol('VES')).toBe('Bs.');
  });

  it('falls back to the currency code when no symbol is defined', () => {
    expect(getCurrencySymbol('USD')).toBe('USD');
  });
});

describe('formatCurrency', () => {
  it('formats a positive amount with the given currency', () => {
    const result = formatCurrency(1234.5, 'USD');
    expect(result).toContain('1.234,50');
    expect(result).toContain('US$');
  });

  it('formats a negative amount', () => {
    const result = formatCurrency(-10, 'ARS');
    expect(result).toContain('-');
  });

  it('defaults to USD when no currency is provided', () => {
    expect(formatCurrency(5)).toContain('US$');
  });

  it('formats VES with the Bs. symbol', () => {
    expect(formatCurrency(1234.5, 'VES')).toBe('Bs. 1.234,50');
  });
});

describe('formatDate', () => {
  it('formats an ISO date with the default pattern', () => {
    expect(formatDate('2024-03-05')).toBe('05/03/2024');
  });

  it('returns an empty string for an invalid date', () => {
    expect(formatDate('not-a-date')).toBe('');
  });
});

describe('formatMonth', () => {
  it('formats a month in Spanish', () => {
    expect(formatMonth(new Date(2024, 2, 10))).toBe('marzo 2024');
  });
});

describe('today and startOfMonth', () => {
  it('returns today in yyyy-MM-dd', () => {
    expect(today()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('returns the first day of the month', () => {
    expect(startOfMonth()).toMatch(/^\d{4}-\d{2}-01$/);
  });
});
