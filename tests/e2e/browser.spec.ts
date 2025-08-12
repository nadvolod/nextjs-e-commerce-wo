import { expect, test } from "@playwright/test";

// Critical UI flows: homepage loads products, add to cart updates cart count

test.describe("E-commerce UI", () => {
  test("homepage displays featured products", async ({ page }) => {
    await page.goto("/");
    // Wait for featured products section
    await expect(page.getByTestId("featured-products-section")).toBeVisible();
    // Expect at least 4 featured product cards present (first 4 sample products)
    const productCards = page.getByTestId(/product-card-/);
    await expect(productCards).toHaveCount(4); // featured slice(0,4)
  });

  test("add to cart increments cart badge", async ({ page }) => {
    await page.goto("/");
    // Add first product to cart
    const firstAddButton = page.getByTestId("add-to-cart-1");
    await expect(firstAddButton).toBeVisible();
    await firstAddButton.click();

    const cartButton = page.getByTestId("cart-button");
    await expect(cartButton).toBeVisible();

    // Open cart to ensure state updated (badge may appear asynchronously)
    await cartButton.click();
    // Close cart by pressing Escape (Sheet)
    await page.keyboard.press("Escape");

    // Badge is inside cart button; assert text 1 eventually
    const badge = cartButton.locator("text=1");
    await expect(badge).toBeVisible();
  });
});
