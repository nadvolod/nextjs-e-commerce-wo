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

  test('PUT /api/cart - updates cart item quantity', async () => {
    const { default: ApiClient, api } = await import('../../src/lib/api-client');
    await api.resetData();

    // Login as a regular user
    const login = await ApiClient.login('user@test.com', 'user123');
    expect(login.success).toBeTruthy();

    // Add a known product (id "1") to cart
    const add = await ApiClient.addToCart('1', 2);
    expect(add.success).toBeTruthy();

    // Update the quantity to 5
    const update = await ApiClient.updateCartItem('1', 5);
    expect(update.success).toBeTruthy();

    // Verify the quantity was updated
    const cart = await ApiClient.getCart();
    expect(cart.success).toBeTruthy();
    expect(cart.data?.items?.length).toBe(1);
    expect(cart.data?.items?.[0].productId).toBe('1');
    expect(cart.data?.items?.[0].quantity).toBe(5);

    // Test edge case: setting quantity to 0 should remove item
    const removeByZero = await ApiClient.updateCartItem('1', 0);
    expect(removeByZero.success).toBeTruthy();

    // Verify item was removed
    const emptyCart = await ApiClient.getCart();
    expect(emptyCart.success).toBeTruthy();
    expect(emptyCart.data?.items?.length || 0).toBe(0);
  });

  test('DELETE /api/cart/item - removes item from cart', async () => {
    const { default: ApiClient, api } = await import('../../src/lib/api-client');
    await api.resetData();

    // Login as a regular user  
    const login = await ApiClient.login('user@test.com', 'user123');
    expect(login.success).toBeTruthy();

    // Add two different products to cart
    const add1 = await ApiClient.addToCart('1', 2);
    expect(add1.success).toBeTruthy();
    const add2 = await ApiClient.addToCart('2', 1);
    expect(add2.success).toBeTruthy();

    // Verify both items are in cart
    const fullCart = await ApiClient.getCart();
    expect(fullCart.success).toBeTruthy();
    expect(fullCart.data?.items?.length).toBe(2);

    // Remove the first product
    const remove = await ApiClient.removeFromCart('1');
    expect(remove.success).toBeTruthy();

    // Verify only the second item remains
    const partialCart = await ApiClient.getCart();
    expect(partialCart.success).toBeTruthy();
    expect(partialCart.data?.items?.length).toBe(1);
    expect(partialCart.data?.items?.[0].productId).toBe('2');
    expect(partialCart.data?.items?.[0].quantity).toBe(1);

    // Remove the remaining item
    const removeLast = await ApiClient.removeFromCart('2');
    expect(removeLast.success).toBeTruthy();

    // Verify cart is empty
    const emptyCart = await ApiClient.getCart();
    expect(emptyCart.success).toBeTruthy();
    expect(emptyCart.data?.items?.length || 0).toBe(0);
  });
});
