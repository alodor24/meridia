import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFetch, useAsyncAction } from './useAsync';
import { ApiError } from '@/services/api/errors';

const resolveAfter = <T,>(value: T, ms = 10): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const rejectAfter = (error: unknown, ms = 10): Promise<never> =>
  new Promise((_, reject) => setTimeout(() => reject(error), ms));

describe('useFetch', () => {
  it('returns the data after a successful fetch', async () => {
    const { result } = renderHook(() => useFetch(() => resolveAfter([1, 2, 3])));

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual([1, 2, 3]);
    expect(result.current.error).toBeNull();
  });

  it('exposes an error message when the fetch fails', async () => {
    const { result } = renderHook(() => useFetch(() => rejectAfter(new ApiError('Algo salió mal'))));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Algo salió mal');
  });
});

describe('useAsyncAction', () => {
  it('returns the action result and toggles loading', async () => {
    const { result } = renderHook(() => useAsyncAction());

    const promise = result.current.run(() => resolveAfter('ok', 5));
    await expect(promise).resolves.toBe('ok');
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
  });

  it('captures the error and returns undefined', async () => {
    const { result } = renderHook(() => useAsyncAction());

    const promise = result.current.run(() => rejectAfter(new ApiError('Falló')));
    await expect(promise).resolves.toBeUndefined();
    await waitFor(() => expect(result.current.error).toBe('Falló'));
    expect(result.current.loading).toBe(false);
  });
});
