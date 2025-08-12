import { test, expect } from '@playwright/test';

// Minimal spark.kv shim for API client (kept intentionally small)
const kvStore = new Map<string, any>();
const sparkKV = {
  get: async (key: string) => (kvStore.has(key) ? kvStore.get(key) : null),
  set: async (key: string, value: any) => { kvStore.set(key, value); },
  delete: async (key: string) => { kvStore.delete(key); },
  keys: async () => Array.from(kvStore.keys()),
};
// @ts-ignore
(globalThis as any).spark = { kv: sparkKV };

// NOTE: Only the single mandated API test (GET products) per instructions. Add more only if requested.

test.describe('E-commerce API Tests (minimal)', () => {
  test('GET /api/products - returns product list', async () => {
    const { default: ApiClient } = await import('../../src/lib/api-client');
    const res = await ApiClient.getProducts();
    expect(res.success).toBeTruthy();
    expect(Array.isArray(res.data)).toBeTruthy();
    expect((res.data || []).length).toBeGreaterThan(0);
  });
});
