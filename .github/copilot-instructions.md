# E-commerce Application - GitHub Copilot Instructions

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Project Overview

This is a React e-commerce application built with Vite, TypeScript, and modern web technologies. The application demonstrates a full-featured e-commerce platform with products, shopping cart, authentication, and checkout functionality.

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS
- **Testing**: Playwright for E2E testing
- **State Management**: React Context API
- **UI Components**: Radix UI with custom components
- **Package Manager**: npm

## Working Effectively

### Bootstrap and Build the Repository

1. **Install dependencies** (takes 1-2 seconds):
   ```bash
   npm install --ignore-scripts
   ```
   **Note**: Use `--ignore-scripts` to avoid Playwright installation issues. Install Playwright separately if needed.

2. **Build the application** (takes ~11 seconds - NEVER CANCEL):
   ```bash
   npm run build
   ```
   **Timeout: Set to 60+ seconds** - Build is fast but allow buffer for slower environments.

3. **Run development server** (starts in ~1 second):
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:5173/`

### Testing

#### E2E Testing Setup Issues
**CRITICAL**: Playwright browser installation currently fails due to network restrictions. The following commands will fail:
- `npm install` (fails during postinstall)
- `npx playwright install`
- `npm run test:e2e`

**Workaround**: Use `npm install --ignore-scripts` and document that E2E tests require manual Playwright setup in different environments.

#### Linting Issues
**CRITICAL**: ESLint configuration is missing. The following command fails:
```bash
npm run lint  # FAILS - no eslint.config.js file
```
**Status**: Linting is broken and needs manual configuration setup.

### Validation Scenarios

**ALWAYS** test the following scenarios after making changes:

1. **Build Validation**:
   ```bash
   npm run build
   ```
   Should complete in ~11 seconds without errors.

2. **Development Server**:
   ```bash
   npm run dev
   ```
   Should start in ~1 second and serve at `http://localhost:5173/`

3. **Core E-commerce Functionality** (MANUAL TEST REQUIRED):
   - Navigate to homepage - should display featured products ✅
   - Click "Products" - should show product catalog with 15 items ✅
   - Add item to cart - cart badge should show count ✅
   - Click cart - should open cart dialog with added items ✅
   - Search functionality should filter products ✅
   - Category filtering should work ✅
   - API Test page - full API testing interface available ✅

4. **Login Flow** (CURRENTLY BROKEN):
   - Click "Login" button
   - Login form appears with test credentials shown
   - **ISSUE**: Authentication fails with "Invalid email or password"
   - **CAUSE**: Browser environment lacks spark.kv backend initialization
   - **WORKAROUND**: Test in guest mode or focus on non-authenticated features

## Command Reference and Timing

| Command | Expected Time | Timeout Setting | Status | Notes |
|---------|---------------|-----------------|--------|-------|
| `npm install --ignore-scripts` | 1-2 seconds | 120 seconds | ✅ Works | Use this instead of `npm install` |
| `npm run build` | ~11 seconds | 60+ seconds | ✅ Works | NEVER CANCEL - fast but allow buffer |
| `npm run dev` | ~1 second | 30 seconds | ✅ Works | Serves on port 5173 |
| `npm run lint` | N/A | N/A | ❌ Broken | No ESLint config file |
| `npm run test:e2e` | N/A | N/A | ❌ Broken | Playwright installation fails |

## Project Structure

### Key Directories
```
├── src/
│   ├── components/          # React components
│   ├── contexts/           # React contexts (Auth, Cart)
│   ├── hooks/              # Custom React hooks  
│   ├── lib/                # Utility functions, API client
│   ├── types/              # TypeScript type definitions
│   └── styles/             # CSS and styling files
├── tests/e2e/              # Playwright E2E tests
├── .github/workflows/      # CI/CD pipeline
└── dist/                   # Build output (after npm run build)
```

### Important Files
- `src/App.tsx` - Main application component with routing
- `src/lib/data.ts` - Sample product data
- `src/contexts/CartContext.tsx` - Shopping cart state management
- `src/contexts/AuthContext.tsx` - Authentication state
- `playwright.config.ts` - E2E test configuration
- `vite.config.ts` - Vite build configuration

## Common Development Tasks

### Adding New Products
- Edit `src/lib/data.ts` 
- Products require: id, name, price, description, category, image, inventory

### Modifying Components
- Components are in `src/components/`
- Use TypeScript for all new components
- Follow existing patterns for data-testid attributes

### Styling Changes
- Uses Tailwind CSS utility classes
- Custom components in `src/components/ui/`
- Theme configuration in `tailwind.config.js`

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) currently:
- Runs on Node.js LTS
- Installs dependencies with `npm ci`
- Attempts Playwright browser installation (currently fails)
- Should run E2E tests (currently broken)

**Known Issues**: The CI pipeline will fail due to Playwright installation issues.

## Troubleshooting

### Common Issues

1. **"Cannot find module 'none'" when running tests**: 
   - This is a Playwright reporter configuration issue
   - Tests are designed to work but Playwright setup is broken

2. **ESLint errors**: 
   - No ESLint configuration file exists
   - Linting must be set up manually

3. **Playwright installation failures**:
   - Network/environment restrictions prevent browser downloads
   - Use `--ignore-scripts` flag for npm install
   - E2E testing requires different environment setup

### Environment Requirements

- Node.js LTS (tested with v20.19.4)
- npm 10+ (tested with v10.8.2)
- Modern browser for manual testing
- Network access to external resources (images load from unsplash.com)

### Known Console Warnings/Errors

The following console messages are expected and do not indicate broken functionality:

1. **Image loading errors**: External images from unsplash.com may be blocked in some environments
2. **Spark KV errors**: `ReferenceError: spark is not defined` - affects authentication but core app works
3. **Google Fonts errors**: Font loading may be blocked but doesn't affect functionality
4. **React DevTools message**: Informational message about React DevTools

These errors do not prevent the core e-commerce functionality from working.

## Development Workflow

1. **ALWAYS** run `npm install --ignore-scripts` first
2. **ALWAYS** run `npm run build` to verify changes don't break build
3. **ALWAYS** run `npm run dev` and manually test core functionality
4. **NEVER CANCEL** build commands - they're fast but always wait for completion
5. **Manual testing is required** - E2E tests cannot be relied upon currently

## Validation Checklist

Before completing any changes:
- [ ] `npm run build` completes successfully
- [ ] Development server starts without errors
- [ ] Homepage loads and displays products correctly
- [ ] Product listing page shows all 15 products
- [ ] Add to cart functionality works
- [ ] Cart displays added items correctly
- [ ] Login flow works with test credentials
- [ ] No console errors in browser developer tools

## API Testing

The application includes API testing functionality:
- Navigate to "API Test" page for manual API validation
- API client is in `src/lib/api-client.ts`
- Uses in-memory backend with localStorage persistence