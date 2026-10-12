# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React + Vite + TypeScript e-commerce demo application (product catalog, cart, auth, checkout, admin dashboard) used as the main project for the "AI For Good" workshop (see `README.md` and `workshop/`). Despite the repo name, this is **not** Next.js — it's a Vite SPA.

## Commands

```bash
npm install --ignore-scripts   # use this, not plain `npm install` — see Playwright note below
npm run dev                    # start dev server at http://localhost:5173/
npm run build                  # tsc -b --noCheck && vite build (~a few seconds)
npm run preview                # preview the production build
npm run test:e2e               # playwright test --reporter=none (requires browsers installed)
npm run test:e2e:ui            # playwright UI mode
npm run test:e2e:headed        # headed browser run
npm run test:e2e:browser       # tests/e2e/browser.spec.ts only
npm run test:e2e:api           # tests/e2e/api.spec.ts only
npm run test:ci                # playwright --project=chromium --reporter=github (used in CI)
```

Run a single test file/case directly with Playwright, e.g.:
```bash
npx playwright test tests/e2e/browser.spec.ts -g "homepage loads" --project=chromium --reporter=dot
```

**Known broken tooling**:
- `npm run lint` fails — no `eslint.config.js` exists despite `eslint` being a devDependency.
- Plain `npm install` can fail/hang on the `postinstall` Playwright browser download in restricted-network environments; use `npm install --ignore-scripts` and install Playwright browsers separately (`npx playwright install --with-deps`) if needed.
- Login flow can fail outside a properly initialized `window.spark.kv` environment (see Architecture below) — test accounts are `admin@test.com` / `admin123` and `user@test.com` / `user123` (see `API_DOCS.md`).

CI (`.github/workflows/ci.yml`) runs on push/PR to `main`, `master`, `lesson03`: `npm ci` → install Playwright browsers → `npx playwright test --project=chromium --reporter=dot`. Only Chromium is used; tests run fully parallel in Playwright config but CI pins `workers: 1`.

## Architecture

**This app has no real server.** All "backend" behavior is simulated client-side:

- `src/lib/api-backend.ts` (`InMemoryApiBackend` / exported singleton `apiBackend`) — a fake REST backend implemented entirely in-memory, persisted via a `spark.kv` key-value store (products, users, orders, sessions, cart). It fakes auth tokens/expiry, pagination, and CRUD for products/cart/orders/admin stats.
- `src/lib/api-client.ts` (`ApiClient` static class + `api` convenience object) — the only interface components should use to talk to the "backend"; it just forwards to `apiBackend`. Prefer importing `api` (e.g. `api.products.getAll()`, `api.cart.add()`) rather than calling `apiBackend` directly.
- `src/lib/data.ts` — seed/sample data (`sampleProducts`, `testUsers`) and helpers (`calculateCartTotals`, `generateOrderId`) used to initialize the in-memory backend on first run.
- **`spark.kv`**: a global (`window.spark.kv`) key-value async store that `api-backend.ts` depends on for persistence. It is *not* defined anywhere in `src/` — in the real browser app this is expected to come from the GitHub Spark runtime; in Playwright tests it's shimmed via `page.addInitScript` in `tests/e2e/browser.spec.ts` (backed by `localStorage`). If `window.spark` is undefined (e.g. opening the app outside that runtime/test shim), backend initialization throws and auth breaks — this is the root cause of the documented "Invalid email or password" issue in local dev.
- `src/hooks/useKV.ts` — a *separate*, simpler localStorage-backed hook (`useKV`) kept API-compatible with the old `@github/spark/hooks` `useKV`, used by components/contexts for local persisted state (distinct from the `spark.kv` global used inside `api-backend.ts`).

**App shell**: `src/App.tsx` does manual client-side "routing" via a `currentPage` string state and a `switch` in `renderCurrentPage()` — there is no router library. Pages: `home`, `products`, `login`, `checkout`, `orders`, `order-confirmation`, `admin`, `api-testing`. Global providers wrap everything: `AuthProvider` (`src/contexts/AuthContext.tsx`) outside `CartProvider` (`src/contexts/CartContext.tsx`).

**UI components**: `src/components/ui/` is a shadcn/ui ("new-york" style) set built on Radix primitives, generated per `components.json` (aliases: `@/components`, `@/lib`, `@/hooks`, `ui: @/components/ui`). Path alias `@/*` → `src/*` (configured in both `tsconfig.json` and `vite.config.ts`). Feature components (`Header`, `Home`, `ProductListing`, `ProductDetails`, `Checkout`, `Orders`, `OrderConfirmation`, `AdminDashboard`, `ApiTesting`, `Login`, `CartSummary`) live directly under `src/components/`.

**`useKV` persistence semantics**: `src/hooks/useKV.ts`'s setter writes through to `localStorage` synchronously inside the same call (not deferred to a `useEffect`), so a value is persisted even if the component unmounts in the same commit as the update (e.g. the Checkout page navigating away immediately after writing the new order).

### WebMCP Declarative API (experimental Chrome origin trial)

Several forms expose themselves as **browser-invocable MCP tools** using Chrome's declarative WebMCP attributes — `toolname`/`tooldescription`/`toolautosubmit` on `<form>`, `toolparamdescription` on inputs. Ambient TypeScript augmentation for these non-standard attributes lives in `src/vite-end.d.ts:24-72` (reference: https://developer.chrome.com/docs/ai/webmcp/declarative-api). Tools currently defined: `login` (`Login.tsx`), `searchProducts` (`Header.tsx`), `filterProductsBySearch` (`ProductListing.tsx`), `checkout` (`Checkout.tsx`), and ~15 `apiTest*` tools in `ApiTesting.tsx`.

Key constraints learned the hard way while fixing this integration — easy to violate when touching any `toolname` form:
- **Never mutate a tracked element while its tool call is pending.** If an `<input>`/`<form>` carrying `toolparamdescription`/`toolname` changes (e.g. a `disabled` prop flipping true) before the submit handler resolves, Chrome's WebMCP engine cancels the in-flight call with `"Tool execution cancelled, since tool definition was updated"`. Loading/disabled state tied to the same inputs the tool reads must not be set synchronously inside the agent-invoked submit path.
- **`toolautosubmit="true"` is required for the browser to actually dispatch a submit event** when the tool is invoked; without it, invocation only focuses and populates the form's fields and waits for a human click — a handler never runs, and the call hangs until the caller's own timeout kills it.
- **Submit handlers must branch on `agentInvoked`** (`(e.nativeEvent as SubmitEvent).agentInvoked === true`) and resolve via `nativeEvent.respondWith(promise)` — see the pattern in `Login.tsx:23-53`, `Header.tsx:25-40`, `Checkout.tsx` `handleSubmit`. For `checkout` specifically, an agent-invoked submit only fills+confirms and must skip order creation/navigation — placing the real order stays gated behind a genuine (non-agent) click on "Place Order".
- **Resolve `respondWith` with the MCP content-block shape** `{ content: [{ type: 'text', text: '...' }] }`, not a bare custom object — this is what `page.webmcp.callTool()` (Playwright) and the WebMCP spec expect back; `result.content[0].text` is the standard way callers read the result. Keep this shape consistent across all tools so test assertions are uniform.

**Testing**: Playwright is the only test framework in use (no unit test runner configured). E2E specs are split into `tests/e2e/browser.spec.ts` (UI flows, relies on `data-testid` attributes on components, including the `'E2E flow with WebMCP'` test which drives the app via `page.webmcp.callTool(...)` with `chromium.launch({ args: ['--enable-features=WebMCP'] })`) and `tests/e2e/api.spec.ts` (exercises the in-memory API via the app). Both require the `window.spark.kv` init script shim shown above when run outside the real Spark runtime. The `chromium` Playwright project runs headed (`playwright.config.ts`), not headless, despite `use.headless: true` at the top level.

Testing conventions carried over from `.github/copilot-instructions.md`: keep tests to the minimum needed to cover critical paths (don't over-test), only target the `chromium` project, don't use a browser for API-only testing, and don't leave `console.log` in test files (it adds noise to Playwright output).

See `API_DOCS.md` for the full simulated API reference (endpoints, response shapes, test accounts) and `PRD.md` for product requirements/feature intent. This repo also doubles as the main project for Nikolay Advolodkin's "AI For Good" workshop (`workshop/`) — unrelated to day-to-day app development but explains some of the README/doc structure.
