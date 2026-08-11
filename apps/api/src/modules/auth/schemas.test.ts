import { describe, expect, it } from 'vitest';
import { registerSchema } from './auth.schemas';
import { createAccountSchema, updateAccountSchema } from '../accounts/accounts.schemas';
import {
  createTransactionSchema,
  listTransactionsQuerySchema,
  updateTransactionSchema,
} from '../transactions/transactions.schemas';
import { createCategorySchema } from '../categories/categories.schemas';
import { dashboardQuerySchema } from '../dashboard/dashboard.schemas';

describe('registerSchema', () => {
  it('normaliza email a minúsculas y país/moneda a mayúsculas', () => {
    const result = registerSchema.safeParse({
      name: '  Ana  ',
      email: '  Ana@TEST.com ',
      password: 'Segura123',
      country: 'ar',
      currency: 'ars',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('ana@test.com');
      expect(result.data.country).toBe('AR');
      expect(result.data.currency).toBe('ARS');
      expect(result.data.name).toBe('Ana');
    }
  });

  it('rechaza país no soportado', () => {
    const result = registerSchema.safeParse({
      name: 'Ana',
      email: 'ana@test.com',
      password: 'Segura123',
      country: 'XX',
      currency: 'ARS',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza contraseña de menos de 8 caracteres', () => {
    const result = registerSchema.safeParse({
      name: 'Ana',
      email: 'ana@test.com',
      password: 'corta',
      country: 'AR',
      currency: 'ARS',
    });
    expect(result.success).toBe(false);
  });
});

describe('account schemas', () => {
  it('crea cuenta con moneda opcional', () => {
    const result = createAccountSchema.safeParse({ name: 'Efectivo', type: 'cash' });
    expect(result.success).toBe(true);
  });

  it('rechaza tipo de cuenta inválido', () => {
    const result = createAccountSchema.safeParse({ name: 'Efectivo', type: 'nft' });
    expect(result.success).toBe(false);
  });

  it('update exige al menos un campo', () => {
    expect(updateAccountSchema.safeParse({}).success).toBe(false);
    expect(updateAccountSchema.safeParse({ name: 'x' }).success).toBe(true);
  });
});

describe('transaction schemas', () => {
  const valid = {
    accountId: '11111111-1111-4111-8111-111111111111',
    categoryId: '22222222-2222-4222-8222-222222222222',
    type: 'expense',
    amount: 10.5,
    date: '2026-08-10',
  };

  it('acepta payload válido', () => {
    expect(createTransactionSchema.safeParse(valid).success).toBe(true);
  });

  it('rechaza monto no positivo', () => {
    expect(createTransactionSchema.safeParse({ ...valid, amount: 0 }).success).toBe(false);
  });

  it('rechaza fecha mal formateada', () => {
    expect(createTransactionSchema.safeParse({ ...valid, date: '10/08/2026' }).success).toBe(false);
  });

  it('update parcial exige al menos un campo', () => {
    expect(updateTransactionSchema.safeParse({}).success).toBe(false);
    expect(updateTransactionSchema.safeParse({ amount: 5 }).success).toBe(true);
  });

  it('list convierte vacíos en undefined y aplica defaults', () => {
    const result = listTransactionsQuerySchema.safeParse({ from: '', limit: '25' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.from).toBeUndefined();
      expect(result.data.limit).toBe(25);
      expect(result.data.offset).toBe(0);
    }
  });
});

describe('category & dashboard schemas', () => {
  it('rechaza color no hex', () => {
    expect(createCategorySchema.safeParse({ name: 'x', type: 'expense', color: 'red' }).success).toBe(false);
    expect(createCategorySchema.safeParse({ name: 'x', type: 'expense', color: '#ff0000' }).success).toBe(true);
  });

  it('dashboard acepta rangos con y sin límite', () => {
    expect(dashboardQuerySchema.safeParse({}).success).toBe(true);
    const result = dashboardQuerySchema.safeParse({ limit: '50' });
    expect(result.success).toBe(true);
  });
});
