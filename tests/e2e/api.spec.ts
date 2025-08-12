import { expect, test } from "@playwright/test";
import { sampleProducts } from "../../src/lib/data";

// Type definitions for spark global mock
interface SparkKV {
  store: Map<string, any>;
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
}

interface SparkGlobal {
  kv: SparkKV;
}

declare global {
  // eslint-disable-next-line no-var
  var spark: SparkGlobal;
}

// Minimal spark.kv mock to satisfy api-backend expectations in Node test context
// Provides get/set/delete on an in-memory Map so ApiClient backend works.
// Must be defined before importing ApiClient (which instantiates backend).
if (!global.spark) {
  global.spark = {
    kv: {
      store: new Map<string, any>(),
      async get<T>(key: string): Promise<T | undefined> {
        return this.store.get(key);
      },
      async set<T>(key: string, value: T): Promise<void> {
        this.store.set(key, value);
      },
      async delete(key: string): Promise<void> {
        this.store.delete(key);
      },
    },
  };
}

// Pre-seed products and users for the backend before it initializes
// @ts-ignore
(global as any).spark.kv.set("api_products", [...sampleProducts]);
// Seed minimal users to satisfy possible auth code paths
// @ts-ignore
(global as any).spark.kv.set("api_users", [
  { id: "1", email: "admin@test.com", name: "Admin User", role: "admin" },
]);

import { ApiClient } from "../../src/lib/api-client";

// Simple API tests using in-memory backend directly

test.describe("API", () => {
  test("get products returns full product list", async () => {
    const resp = await ApiClient.getProducts();
    expect(resp.success).toBeTruthy();
    expect(resp.data).toBeDefined();
    expect(Array.isArray(resp.data)).toBeTruthy();
    // Expect same number of products as sample data (15)
    expect(resp.data!.length).toBe(sampleProducts.length);
    // Basic shape check
    const first = resp.data![0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("name");
    expect(first).toHaveProperty("price");
  });
});
