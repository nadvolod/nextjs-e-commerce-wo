import { expect, test } from "@playwright/test";

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
    await expect(addToCartButton).not.toBeDisabled();
    await addToCartButton.click();

    // Open cart and verify cart UI appears
    const cartButton = page.locator('[data-testid="cart-button"]');
    await expect(cartButton).toBeVisible();
    await cartButton.click();

    // Assert a unique element in the cart drawer
    const cartDialog = page.getByRole("dialog");
    await expect(cartDialog).toBeVisible();
    await expect(
      cartDialog.getByRole("heading", { name: "Shopping Cart" })
    ).toBeVisible();
  });

  test("basic checkout flow form validation", async ({ page }) => {
    // 0) Log in deterministically via header button if visible
    const headerLogin = page
      .locator("header")
      .getByRole("button", { name: "Login" })
      .first();
    if (await headerLogin.isVisible()) {
      await headerLogin.click();
      await page.getByLabel("Email").fill("user@test.com");
      await page.getByLabel("Password").fill("user123");
      await page.getByRole("button", { name: "Sign In" }).click();
    }

    // Ensure Home is visible
    await page
      .locator("header")
      .getByRole("button", { name: "Home" })
      .first()
      .click();
    await expect(
      page.locator('[data-testid="featured-products-section"]')
    ).toBeVisible();

    // 1) Add first featured product to cart from Home
    await page.waitForSelector('[data-testid^="product-card-"]');
    await page.locator('[data-testid^="add-to-cart-"]').first().click();

    // 2) Open cart dialog
    const cartButton = page.locator('[data-testid="cart-button"]');
    await cartButton.click();
    const cartDialog = page.getByRole("dialog");
    await expect(cartDialog).toBeVisible();

    // 3) Proceed to checkout (user should be logged in)
    const proceedBtn = cartDialog.locator(
      '[data-testid="proceed-to-checkout-button"]'
    );
    await expect(proceedBtn).toBeVisible();
    await proceedBtn.click();

    // 3.1) Close the cart sheet to prevent overlay from intercepting clicks
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page.locator('[data-slot="sheet-overlay"]')).toHaveCount(0);

    // 4) On checkout page, verify form and HTML5 validation
    await expect(page.getByRole("heading", { name: "Checkout" })).toBeVisible();
    const checkoutForm = page.locator('[data-testid="checkout-form"]');
    await expect(checkoutForm).toBeVisible();

    const placeOrder = page.locator('[data-testid="place-order-button"]');

    // Attempt submit with empty required fields should trigger :invalid inputs
    await placeOrder.click();
    const invalidCount = await page
      .locator('[data-testid="checkout-form"] input:invalid')
      .count();
    expect(invalidCount).toBeGreaterThan(0);

    // Fill required fields
    await page.fill('[data-testid="fullName-input"]', "Test User");
    await page.fill("#address", "123 Main St");
    await page.fill("#city", "Springfield");
    await page.fill("#state", "CA");
    await page.fill("#zipCode", "90210");
    await page.fill("#nameOnCard", "Test User");
    await page.fill("#cardNumber", "4242 4242 4242 4242");
    await page.fill("#expiryDate", "12/30");
    await page.fill("#cvv", "123");

    // After filling, inputs should no longer be invalid
    const remainingInvalid = await page
      .locator('[data-testid="checkout-form"] input:invalid')
      .count();
    expect(remainingInvalid).toBe(0);

    // Submit and verify processing state (proof that validation passed)
    await placeOrder.click();
    await expect(placeOrder).toHaveText(/Processing Payment/);
  });
});
