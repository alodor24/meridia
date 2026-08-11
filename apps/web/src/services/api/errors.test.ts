import { describe, it, expect } from 'vitest';
import { ApiError, toApiError } from './errors';

describe('toApiError', () => {
  it('returns the same instance when it is already an ApiError', () => {
    const error = new ApiError('Ya es un error');
    expect(toApiError(error)).toBe(error);
  });

  it('maps an axios-like response payload', () => {
    const error = {
      response: {
        status: 400,
        data: { error: { message: 'Email inválido', code: 'VALIDATION_ERROR' } },
      },
    };
    const result = toApiError(error);
    expect(result).toBeInstanceOf(ApiError);
    expect(result.message).toBe('Email inválido');
    expect(result.code).toBe('VALIDATION_ERROR');
    expect(result.status).toBe(400);
  });

  it('maps a 401 response without payload', () => {
    const result = toApiError({ response: { status: 401 } });
    expect(result.code).toBe('UNAUTHENTICATED');
    expect(result.message).toContain('sesión');
  });

  it('maps a plain Error', () => {
    const result = toApiError(new Error('Sin red'));
    expect(result.message).toBe('Sin red');
  });

  it('maps unknown values to a generic message', () => {
    expect(toApiError('foo').message).toContain('inesperado');
  });
});
