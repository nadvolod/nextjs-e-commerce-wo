import { test, expect } from '@playwright/test';

// Simple in-memory KV for Node test environment to satisfy api-backend's spark.kv usage
const kvStore = new Map<string, any>();
const sparkKV = {
  get: async (key: string) => (kvStore.has(key) ? kvStore.get(key) : null),
  set: async (key: string, value: any) => { kvStore.set(key, value); },
  delete: async (key: string) => { kvStore.delete(key); },
  keys: async () => Array.from(kvStore.keys()),
};

// @ts-ignore define global spark for api-backend
(globalThis as any).spark = { kv: sparkKV };

test.describe('E-commerce API Tests (without browser)', () => {
  test('GET /api/products - returns product list', async () => {
    const { default: ApiClient } = await import('../../src/lib/api-client');
    const res = await ApiClient.getProducts();
    expect(res.success).toBeTruthy();
    expect(Array.isArray(res.data)).toBeTruthy();
    expect((res.data || []).length).toBeGreaterThan(0);
  });

  test('POST /api/cart - adds item to cart', async () => {
    const { default: ApiClient, api } = await import('../../src/lib/api-client');
    await api.resetData();

    // Login as a regular user
    const login = await ApiClient.login('user@test.com', 'user123');
    expect(login.success).toBeTruthy();

    // Add a known product (id "1") to cart
    const add = await ApiClient.addToCart('1', 1);
    expect(add.success).toBeTruthy();

    // Read back cart
    const cart = await ApiClient.getCart();
    expect(cart.success).toBeTruthy();
    expect(cart.data?.items?.length || 0).toBeGreaterThan(0);
    expect(cart.data?.items?.[0].productId).toBe('1');
  });
});
