import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('tokenManager', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    vi.resetModules();
  });

  it('persists the token in sessionStorage', async () => {
    const { tokenManager } = await import('./tokenManager');

    expect(tokenManager.getAccessToken()).toBeNull();
    tokenManager.setAccessToken('abc');

    expect(tokenManager.getAccessToken()).toBe('abc');
    expect(window.sessionStorage.getItem('meridia_access_token')).toBe('abc');
  });

  it('restores the token from sessionStorage after a reload', async () => {
    const { tokenManager } = await import('./tokenManager');
    tokenManager.setAccessToken('abc');

    vi.resetModules();
    const { tokenManager: fresh } = await import('./tokenManager');

    expect(fresh.getAccessToken()).toBe('abc');
  });

  it('clears the token from memory and storage', async () => {
    const { tokenManager } = await import('./tokenManager');

    tokenManager.setAccessToken('abc');
    tokenManager.clear();

    expect(tokenManager.getAccessToken()).toBeNull();
    expect(window.sessionStorage.getItem('meridia_access_token')).toBeNull();
  });
});
