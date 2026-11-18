import { describe, expect, it } from 'vitest';
import {
  forgotPasswordSchema,
  registerSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from './auth.schemas';
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
      password: 'Meridia2026!Segura',
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
      password: 'Meridia2026!Segura',
      country: 'XX',
      currency: 'ARS',
    });
    expect(result.success).toBe(false);
  });

  it('acepta una contraseña fuerte', () => {
    const result = registerSchema.safeParse({
      name: 'Ana',
      email: 'ana@test.com',
      password: 'Meridia2026!Segura',
      country: 'AR',
      currency: 'ARS',
    });
    expect(result.success).toBe(true);
  });

  it('rechaza contraseñas que no cumplen la política', () => {
    const base = {
      name: 'Ana',
      email: 'ana@test.com',
      country: 'AR',
      currency: 'ARS',
    };
    const invalidPasswords = [
      'corta',
      'Meridia2026',
      'meridia2026!segura',
      'MERIDIA2026!SEGURA',
      'Meridia!Segura',
      'Meridia2026Segura',
      'Meridia1!    ',
      'Meridia2026!Segura'.repeat(4),
    ];

    for (const password of invalidPasswords) {
      const result = registerSchema.safeParse({ ...base, password });
      expect(result.success, password).toBe(false);
    }
  });
});

describe('forgotPasswordSchema', () => {
  it('normaliza el email a minúsculas', () => {
    const result = forgotPasswordSchema.safeParse({
      email: '  Ana@TEST.com ',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('ana@test.com');
    }
  });

  it('rechaza un email inválido', () => {
    expect(
      forgotPasswordSchema.safeParse({ email: 'no-es-email' }).success,
    ).toBe(false);
  });
});

describe('resetPasswordSchema', () => {
  const token = 'token-de-restablecimiento-suficientemente-largo';

  it('acepta token y contraseña fuerte', () => {
    expect(
      resetPasswordSchema.safeParse({
        token,
        password: 'Meridia2026!Segura',
      }).success,
    ).toBe(true);
  });

  it('rechaza token corto y contraseñas débiles', () => {
    expect(
      resetPasswordSchema.safeParse({
        token: 'corto',
        password: 'Meridia2026!Segura',
      }).success,
    ).toBe(false);

    for (const password of [
      'Meridia2026',
      'meridia2026!segura',
      'MERIDIA2026!SEGURA',
      'Meridia!Segura',
      'Meridia2026Segura',
      'Meridia1!    ',
    ]) {
      expect(
        resetPasswordSchema.safeParse({ token, password }).success,
        password,
      ).toBe(false);
    }
  });
});

describe('updateProfileSchema', () => {
  const publicId = 'meridia/avatars/7f9c2b1a/avatar-1';
  const avatar = `https://res.cloudinary.com/demo/image/upload/v123/${publicId}.webp`;

  it('acepta nombre, avatar o ambos', () => {
    expect(updateProfileSchema.safeParse({ name: 'Ana' }).success).toBe(true);
    expect(
      updateProfileSchema.safeParse({ avatar, avatarPublicId: publicId })
        .success,
    ).toBe(true);
    expect(
      updateProfileSchema.safeParse({
        name: 'Ana',
        avatar,
        avatarPublicId: publicId,
      }).success,
    ).toBe(true);
  });

  it('rechaza un body vacío', () => {
    expect(updateProfileSchema.safeParse({}).success).toBe(false);
  });

  it('rechaza un avatar sin public_id', () => {
    expect(updateProfileSchema.safeParse({ avatar }).success).toBe(false);
  });

  it('rechaza un public_id que no coincide con la URL', () => {
    expect(
      updateProfileSchema.safeParse({
        avatar,
        avatarPublicId: 'meridia/avatars/7f9c2b1a/avatar-2',
      }).success,
    ).toBe(false);
  });

  it('rechaza URLs que no sean de Cloudinary', () => {
    expect(
      updateProfileSchema.safeParse({
        avatar: 'https://example.com/avatar.webp',
        avatarPublicId: publicId,
      }).success,
    ).toBe(false);
    expect(
      updateProfileSchema.safeParse({
        avatar: `http://res.cloudinary.com/demo/image/upload/v123/${publicId}.webp`,
        avatarPublicId: publicId,
      }).success,
    ).toBe(false);
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
