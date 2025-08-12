import { expect, test } from "@playwright/test";

// NOTE: This file intentionally keeps ONLY the critical user flows defined in the test prompt:
// 1. Homepage displays products
// 2. Add to cart works
// Keep tests minimal; expand only if explicitly requested.

test.describe("E-commerce Browser Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Provide a simple window.spark.kv backed by localStorage before app scripts run
    await page.addInitScript(() => {
      // @ts-ignore
      window.spark = {
        kv: {
          get: async (key: string) => {
            try {
              const raw = localStorage.getItem(key);
              return raw ? JSON.parse(raw) : null;
            } catch {
              return null;
            }
          },
          set: async (key: string, value: any) => {
            try {
              localStorage.setItem(key, JSON.stringify(value));
            } catch {}
          },
          delete: async (key: string) => {
            try {
              localStorage.removeItem(key);
            } catch {}
          },
          keys: async () => Object.keys(localStorage),
        },
      } as any;
    });

    // Go to homepage before each test
    await page.goto("/");
  });

  test("homepage loads and displays products", async ({ page }) => {
    // Check if the page title is loaded
    await expect(page).toHaveTitle(/E-commerce Testing App/);

    // Wait for featured products section to be visible
    await expect(
      page.locator('[data-testid="featured-products-section"]')
    ).toBeVisible();

    // Check that the products grid is visible and contains products
    const productsGrid = page.locator('[data-testid="products-grid"]');
    await expect(productsGrid).toBeVisible();

    // Check that there are product cards displayed
    const productCards = page.locator('[data-testid^="product-card-"]');
    await expect(productCards).toHaveCount(4); // Featured products should show 4 items

    // Verify product cards contain essential elements
    const firstProduct = productCards.first();
    await expect(
      firstProduct.locator('[data-testid^="product-image-"]')
    ).toBeVisible();
    await expect(
      firstProduct.locator('[data-testid^="add-to-cart-"]')
    ).toBeVisible();
  });

  test("add product to cart workflow", async ({ page }) => {
    // Wait for products to load (on Home featured section)
    await page.waitForSelector('[data-testid^="product-card-"]');

    // Click add to cart button on the first product
    const addToCartButton = page
      .locator('[data-testid^="add-to-cart-"]')
      .first();
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    // Open cart and verify cart UI appears
    const cartButton = page.locator('[data-testid="cart-button"]');
    await cartButton.click();

    const cartDialog = page.getByRole("dialog");
    await expect(cartDialog).toBeVisible();
    await expect(
      cartDialog.getByRole("heading", { name: "Shopping Cart" })
    ).toBeVisible();
  });
});
