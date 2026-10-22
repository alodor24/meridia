import { afterEach, describe, expect, it, vi } from 'vitest';
import { deleteCloudinaryAsset } from './cloudinary';

afterEach(() => {
  vi.unstubAllGlobals();
});

const mockFetchSuccess = (result: string) =>
  vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

describe('deleteCloudinaryAsset', () => {
  it('firma y envía la petición de destroy a Cloudinary', async () => {
    const fetchMock = mockFetchSuccess('ok');
    vi.stubGlobal('fetch', fetchMock);

    const publicId = 'meridia/avatars/7f9c2b1a/avatar-1';
    const result = await deleteCloudinaryAsset(publicId);

    expect(result).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(
      'https://api.cloudinary.com/v1_1/test-cloud/image/destroy',
    );
    expect(options.method).toBe('POST');

    const body = options.body as URLSearchParams;
    expect(body.get('public_id')).toBe(publicId);
    expect(body.get('api_key')).toBe('test-key');
    expect(body.get('invalidate')).toBe('true');
    expect(body.get('signature')).toMatch(/^[a-f0-9]{40}$/);
  });

  it('devuelve false si Cloudinary responde con error', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: { message: 'invalid' } }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      deleteCloudinaryAsset('meridia/avatars/7f9c2b1a/avatar-1'),
    ).resolves.toBe(false);
  });

  it('devuelve false si la petición falla', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));

    await expect(
      deleteCloudinaryAsset('meridia/avatars/7f9c2b1a/avatar-1'),
    ).resolves.toBe(false);
  });
});
