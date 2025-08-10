# Module 5: Advanced Testing Strategies

## Overview

This module covers advanced testing techniques including performance testing, accessibility validation, visual regression testing, and specialized testing approaches for modern e-commerce applications.

## Learning Objectives

By the end of this module, you'll be able to:

- Implement comprehensive performance testing
- Validate accessibility standards (WCAG 2.1)
- Set up visual regression testing
- Test mobile and responsive designs
- Implement security testing practices
- Create test data management strategies

## Performance Testing

### Core Web Vitals Testing

```javascript
// Lighthouse CI integration
const lighthouseConfig = {
  extends: "lighthouse:default",
  settings: {
    onlyAudits: [
      "first-contentful-paint",
      "largest-contentful-paint",
      "first-meaningful-paint",
      "speed-index",
      "cumulative-layout-shift",
    ],
  },
  audits: ["accessibility", "best-practices", "performance", "seo"],
};

test("Core Web Vitals", async ({ page }) => {
  await page.goto("/");

  const lighthouse = await runLighthouse(page, lighthouseConfig);

  expect(lighthouse.performance).toBeGreaterThan(90);
  expect(lighthouse.accessibility).toBeGreaterThan(95);
});
```

### Load Testing

```javascript
// Artillery.js configuration
const loadTestConfig = {
  config: {
    target: process.env.TARGET_URL,
    phases: [
      { duration: 60, arrivalRate: 10 }, // Warm up
      { duration: 300, arrivalRate: 50 }, // Load test
      { duration: 60, arrivalRate: 100 }, // Spike test
    ],
  },
  scenarios: [
    {
      name: "User Journey - Browse to Purchase",
      weight: 80,
      flow: [
        { get: { url: "/" } },
        { get: { url: "/products" } },
        { get: { url: "/products/{{ productId }}" } },
        { post: { url: "/api/cart", json: { productId: "{{ productId }}" } } },
      ],
    },
  ],
};
```

## Accessibility Testing

### Automated Accessibility Testing

```javascript
// axe-playwright integration
import { injectAxe, checkA11y } from "axe-playwright";

test("Accessibility - Product Page", async ({ page }) => {
  await page.goto("/products/123");
  await injectAxe(page);

  await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: { html: true },
    rules: {
      "color-contrast": { enabled: true },
      "keyboard-navigation": { enabled: true },
      "focus-management": { enabled: true },
    },
  });
});

// Custom accessibility checks
test("Keyboard Navigation", async ({ page }) => {
  await page.goto("/checkout");

  // Test tab order
  await page.keyboard.press("Tab");
  let focusedElement = await page.evaluate(
    () => document.activeElement.tagName
  );
  expect(focusedElement).toBe("INPUT");

  // Test skip links
  await page.keyboard.press("Tab");
  const skipLink = page.locator('[href="#main-content"]');
  await expect(skipLink).toBeFocused();
});
```

### Screen Reader Testing

```javascript
// Screen reader simulation
test("Screen Reader Compatibility", async ({ page }) => {
  await page.goto("/products");

  // Check for proper heading structure
  const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();
  const headingLevels = await Promise.all(headings.map((h) => h.textContent()));

  // Verify proper heading hierarchy
  expect(headingLevels[0]).toContain("Products"); // h1
  expect(headings.length).toBeGreaterThan(0);

  // Check ARIA labels
  const buttons = page.locator("button[aria-label]");
  await expect(buttons).toHaveCount(greaterThan(0));
});
```

## Visual Regression Testing

### Percy Integration

```javascript
// Percy visual testing
import percySnapshot from "@percy/playwright";

test("Visual Regression - Homepage", async ({ page }) => {
  await page.goto("/");

  // Wait for dynamic content
  await page.waitForSelector('[data-testid="product-grid"]');
  await page.waitForTimeout(1000); // Allow animations to complete

  // Take Percy snapshot
  await percySnapshot(page, "Homepage - Desktop");

  // Test mobile view
  await page.setViewportSize({ width: 375, height: 667 });
  await percySnapshot(page, "Homepage - Mobile");
});

// Cross-browser visual testing
const browsers = ["chromium", "firefox", "webkit"];
browsers.forEach((browserName) => {
  test(`Visual consistency - ${browserName}`, async () => {
    const browser = await playwright[browserName].launch();
    const page = await browser.newPage();

    await page.goto("/checkout");
    await percySnapshot(page, `Checkout - ${browserName}`);

    await browser.close();
  });
});
```

### Custom Visual Testing

```javascript
// Playwright built-in screenshot comparison
test("Visual Regression - Product Card", async ({ page }) => {
  await page.goto("/products");

  const productCard = page.locator('[data-testid="product-card"]').first();

  await expect(productCard).toHaveScreenshot("product-card.png", {
    threshold: 0.2,
    maxDiffPixels: 100,
  });
});
```

## Mobile and Responsive Testing

### Device Testing

```javascript
// Test across different devices
const devices = [
  "iPhone 13",
  "iPhone 13 Pro",
  "Samsung Galaxy S21",
  "iPad",
  "Desktop Chrome",
];

devices.forEach((deviceName) => {
  test(`Responsive Design - ${deviceName}`, async ({ browser }) => {
    const context = await browser.newContext({
      ...devices[deviceName],
    });

    const page = await context.newPage();
    await page.goto("/");

    // Test responsive navigation
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    if (deviceName.includes("iPhone") || deviceName.includes("Samsung")) {
      await expect(mobileMenu).toBeVisible();
    } else {
      await expect(mobileMenu).toBeHidden();
    }

    // Test responsive grid
    const productGrid = page.locator('[data-testid="product-grid"]');
    const gridColumns = await productGrid.evaluate(
      (el) => getComputedStyle(el).gridTemplateColumns
    );

    // Verify appropriate number of columns
    if (deviceName.includes("iPhone")) {
      expect(gridColumns).toContain("1fr"); // Single column
    } else if (deviceName.includes("iPad")) {
      expect(gridColumns.split(" ").length).toBe(2); // Two columns
    }

    await context.close();
  });
});
```

### Touch and Gesture Testing

```javascript
// Mobile gesture testing
test("Touch Interactions - Product Gallery", async ({ page }) => {
  await page.goto("/products/123");

  const gallery = page.locator('[data-testid="product-gallery"]');

  // Test swipe gestures
  await gallery.hover();
  await page.touchscreen.tap(100, 100);

  // Simulate swipe
  await page.touchscreen.tap(300, 200);
  await page.mouse.down();
  await page.mouse.move(100, 200);
  await page.mouse.up();

  // Verify image changed
  const activeImage = gallery.locator(".active img");
  await expect(activeImage).toHaveAttribute("src", /image-2/);
});
```

## Security Testing

### Input Validation Testing

```javascript
// XSS prevention testing
test("Security - XSS Prevention", async ({ page }) => {
  await page.goto("/search");

  const searchInput = page.locator('[data-testid="search-input"]');
  const maliciousScript = '<script>alert("XSS")</script>';

  await searchInput.fill(maliciousScript);
  await searchInput.press("Enter");

  // Verify script is not executed
  const searchResults = page.locator('[data-testid="search-results"]');
  const innerHTML = await searchResults.innerHTML();

  expect(innerHTML).not.toContain("<script>");
  expect(innerHTML).toContain("&lt;script&gt;"); // Should be escaped
});

// SQL injection testing
test("Security - SQL Injection Prevention", async ({ request }) => {
  const maliciousInput = "'; DROP TABLE products; --";

  const response = await request.post("/api/products/search", {
    data: { query: maliciousInput },
  });

  expect(response.status()).toBe(200);

  // Verify database wasn't affected
  const productsResponse = await request.get("/api/products");
  expect(productsResponse.status()).toBe(200);
});
```

### Authentication Security

```javascript
// JWT security testing
test("Security - JWT Validation", async ({ request }) => {
  // Test with invalid JWT
  const invalidToken = "invalid.jwt.token";

  const response = await request.get("/api/user/profile", {
    headers: { Authorization: `Bearer ${invalidToken}` },
  });

  expect(response.status()).toBe(401);

  // Test with expired JWT
  const expiredToken = generateExpiredJWT();

  const expiredResponse = await request.get("/api/user/profile", {
    headers: { Authorization: `Bearer ${expiredToken}` },
  });

  expect(expiredResponse.status()).toBe(401);
});
```

## Test Data Management

### Dynamic Test Data Generation

```javascript
// Faker.js integration for realistic test data
import { faker } from "@faker-js/faker";

class TestDataFactory {
  static createUser() {
    return {
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country(),
      },
    };
  }

  static createProduct() {
    return {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      category: faker.commerce.department(),
      inStock: faker.datatype.boolean(),
      images: Array.from({ length: 3 }, () => faker.image.url()),
    };
  }

  static createOrder(userId, products) {
    return {
      id: faker.string.uuid(),
      userId,
      items: products.map((product) => ({
        productId: product.id,
        quantity: faker.number.int({ min: 1, max: 5 }),
        price: product.price,
      })),
      status: faker.helpers.arrayElement(["pending", "processing", "shipped"]),
      createdAt: faker.date.recent(),
    };
  }
}

// Usage in tests
test("Order Processing - Multiple Items", async ({ page }) => {
  const user = TestDataFactory.createUser();
  const products = Array.from({ length: 3 }, () =>
    TestDataFactory.createProduct()
  );
  const order = TestDataFactory.createOrder(user.id, products);

  // Seed test data
  await seedDatabase({ user, products, order });

  // Test order processing
  await page.goto(`/orders/${order.id}`);
  await expect(page.locator('[data-testid="order-status"]')).toHaveText(
    order.status
  );
});
```

### Database State Management

```javascript
// Database cleanup and seeding
class DatabaseManager {
  static async seedTestData() {
    await db.users.deleteMany({});
    await db.products.deleteMany({});
    await db.orders.deleteMany({});

    const users = Array.from({ length: 10 }, () =>
      TestDataFactory.createUser()
    );
    const products = Array.from({ length: 50 }, () =>
      TestDataFactory.createProduct()
    );

    await db.users.insertMany(users);
    await db.products.insertMany(products);

    return { users, products };
  }

  static async cleanupTestData() {
    await db.users.deleteMany({ email: /@example\.com$/ });
    await db.orders.deleteMany({ status: "test" });
  }
}

// Test hooks
test.beforeEach(async () => {
  await DatabaseManager.seedTestData();
});

test.afterEach(async () => {
  await DatabaseManager.cleanupTestData();
});
```

## Exercise: Advanced Testing Implementation

### Task 1: Performance Testing Setup (25 minutes)

1. Install and configure Lighthouse CI
2. Set up performance budgets
3. Create load testing scenarios
4. Implement Core Web Vitals monitoring

### Task 2: Accessibility Testing (30 minutes)

1. Install axe-playwright
2. Create comprehensive accessibility test suite
3. Test keyboard navigation
4. Validate ARIA implementation

### Task 3: Visual Regression Testing (20 minutes)

1. Set up Percy or alternative visual testing
2. Create baseline screenshots
3. Test responsive design variations
4. Implement cross-browser visual tests

### Task 4: Security Testing (15 minutes)

1. Implement XSS prevention tests
2. Test authentication security
3. Validate input sanitization
4. Test API security endpoints

## Best Practices for Advanced Testing

### 1. Test Pyramid Optimization

- Focus on unit tests for business logic
- Use integration tests for API contracts
- Limit E2E tests to critical user journeys
- Add specialized tests for specific concerns

### 2. Performance Monitoring

- Set realistic performance budgets
- Monitor trends over time
- Test on representative devices/networks
- Integrate with CI/CD pipeline

### 3. Accessibility as Code

- Include accessibility in code reviews
- Automate accessibility testing
- Test with real assistive technologies
- Involve users with disabilities in testing

### 4. Continuous Visual Testing

- Maintain visual baselines
- Test across multiple viewports
- Consider dynamic content variations
- Balance thoroughness with execution time

## What's Next?

You've now covered the complete spectrum of modern testing practices. The final module will wrap up with conclusions, next steps, and resources for continued learning.

---

**Continue to:** [06-CONCLUSIONS.md](./06-CONCLUSIONS.md)
