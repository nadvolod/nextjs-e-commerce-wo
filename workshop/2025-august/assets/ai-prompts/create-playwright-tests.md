# AI Prompt: Create Playwright Tests

## Primary Prompt for GitHub Copilot

```
Create a simple Playwright test suite for our e-commerce app with these requirements:

CONTEXT:
- Next.js e-commerce app (likely running on localhost:5173)
- Focus on critical user paths only
- Time-constrained implementation
- Always review this file after every iteration. Always re-run tests after every update.

TESTS NEEDED:
1. Browser Tests (3 essential flows):
   - Homepage loads and displays products
   - Add product to cart workflow
   - Basic checkout flow (form validation)

2. API Tests (2 core endpoints):
   - GET /api/products - returns product list
   - POST /api/cart - adds item to cart

CONSTRAINTS:
- Keep tests minimal but robust
- Use simple selectors (data-testid preferred). If they don't exist, add data-testid to the app
- No complex test data setup
- Basic assertions only
- Single test file for each type

STRUCTURE:
- /tests/e2e/browser.spec.ts
- /tests/e2e/api.spec.ts
- playwright.config.ts

Test Execution
- Run tests in the background using terminal commands
- Analyze test results programmatically and provide summary of outcomes
- Only show test failures or issues that need attention
- Run tests automatically after creation
- Keep iterating until tests are working
- Only create automated tests on chromium
- Don't use a browser for API testing
- Run tests in parallel
- Console.log statements should not be used in test files as they create noise in test output.
- Always run `npx playwright test --reporter=none` on localhost. Use a more robust reporter in CI

Please generate the complete test suite with configuration.
```

## Follow-up Prompts (if needed)

### For Component Updates

```
Add data-testid attributes to these components for reliable testing: [list key components]
```

### For Debugging

```
The test failed with this error: [paste error] - fix the selector/assertion
```

### For Configuration

```
Update the playwright config to run tests in headed mode for debugging
```

## Expected Output Structure

```
tests/
├── e2e/
│   ├── browser.spec.ts    # 3 critical user flows
│   └── api.spec.ts        # 2 API endpoint tests
├── playwright.config.ts   # Simple config
└── package.json          # Updated with playwright scripts
```

## Test Priorities (for time constraints)

### Must Have (5 minutes implementation)

1. Homepage displays products
2. Add to cart works
3. API returns products

### Nice to Have (if time permits)

1. Checkout form validation
2. Cart API endpoint
3. Error handling tests

This approach provides a complete, minimal test suite covering critical paths without complex scenarios or extensive setup.
