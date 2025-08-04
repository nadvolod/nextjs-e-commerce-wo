# E-commerce Testing Application

A complete e-commerce web application built with React, TypeScript, and Tailwind CSS, featuring an in-memory API backend for comprehensive testing without external dependencies.

## Table of Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Testing Scenarios](#testing-scenarios)
- [Development Guide](#development-guide)
- [Architecture](#architecture)

## Quick Start

1. **Installation**
   ```bash
   npm install
   ```

2. **Development**
   ```bash
   npm run dev
   ```

3. **Test Accounts**
   - **Admin**: `admin@test.com` / `admin123`
   - **Customer**: `user@test.com` / `user123`

The application will start at `http://localhost:5173` with a fully functional in-memory API backend.

## Features

### 🛍️ Core E-commerce Functionality
- **Product Catalog**: Browse products with search and category filtering
- **Shopping Cart**: Add, update, and remove items with real-time calculations
- **User Authentication**: Login/logout with role-based access control
- **Order Management**: Complete checkout process with order history
- **Admin Dashboard**: Product management and order administration

### 🔧 Testing & Development Features
- **In-Memory API Backend**: Full REST API simulation without external dependencies
- **Session Persistence**: Data persists across page refreshes using spark.kv
- **Mock Authentication**: JWT-like token simulation for realistic auth testing
- **Network Delay Simulation**: Configurable delays for testing loading states
- **Data Reset Utilities**: Easy way to reset data for clean testing scenarios

### 📱 User Interface
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI Components**: Built with shadcn/ui components and Tailwind CSS
- **Real-time Updates**: Cart and inventory updates reflect immediately
- **Loading States**: Comprehensive loading and error state handling
- **Toast Notifications**: User feedback for all actions

## API Documentation

The application includes a comprehensive in-memory API backend that simulates a real e-commerce API.

### API Client Usage

```typescript
import { api } from '@/lib/api-client';

// Authentication
const loginResult = await api.login('user@test.com', 'user123');
const currentUser = await api.getCurrentUser();
await api.logout();

// Products
const products = await api.products.getAll({ search: 'headphones', category: 'Electronics' });
const product = await api.products.getById('1');

// Cart operations
await api.cart.add('1', 2); // Add 2 units of product '1'
const cart = await api.cart.get();
await api.cart.update('1', 3); // Update quantity to 3
await api.cart.remove('1');

// Orders
const order = await api.orders.create();
const orders = await api.orders.getAll();
```

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout  
- `GET /api/auth/me` - Get current user

#### Products
- `GET /api/products` - List products (supports search, category, pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

#### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:productId` - Update item quantity
- `DELETE /api/cart/remove/:productId` - Remove item
- `DELETE /api/cart/clear` - Clear entire cart

#### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get specific order
- `POST /api/orders` - Create order from cart
- `PUT /api/orders/:id/status` - Update order status (admin only)

#### Admin
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get system statistics

### API Response Format

All API endpoints return responses in a consistent format:

```typescript
{
  success: boolean;
  data?: any;           // Response data (when successful)
  error?: string;       // Error message (when failed)
  message?: string;     // Success/info message
  pagination?: {        // For paginated results
    page: number;
    limit: number;
    total: number;
  };
}
```

## Authentication

### Test Accounts

The application comes with two pre-configured test accounts:

| Email | Password | Role | Access |
|-------|----------|------|---------|
| `admin@test.com` | `admin123` | Admin | Full access including product management |
| `user@test.com` | `user123` | Customer | Shopping and order management |

### Authentication Flow

1. **Login**: Submit credentials to receive a session token
2. **Session Management**: Token automatically stored and included in requests
3. **Role-based Access**: Different features available based on user role
4. **Session Persistence**: Login state persists across page refreshes
5. **Auto Logout**: Sessions expire after 24 hours

### Using Authentication in Components

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isLoading } = useAuth();

  const handleLogin = async () => {
    const success = await login('user@test.com', 'user123');
    if (success) {
      // Login successful
    }
  };

  return (
    <div>
      {user ? (
        <p>Welcome, {user.name}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

## Testing Scenarios

### Using the API Testing Console

The application includes a comprehensive API testing console accessible via the "API Test" link in the navigation. This console allows you to:

- Configure test data (credentials, product IDs, search terms)
- Execute individual API endpoints with real-time results
- View formatted API responses
- Test different user scenarios (customer vs admin)
- Reset data for clean testing

### Automated Test Suite

Run the complete test suite programmatically:

```typescript
import { runAllTests } from '@/lib/api-tests';

// Run all tests
const results = await runAllTests();

// Or run individual test suites
import { runApiTests, runErrorTests, runPerformanceTests } from '@/lib/api-tests';

await runApiTests();        // Basic functionality tests
await runErrorTests();      // Error handling tests  
await runPerformanceTests(); // Performance benchmarks
```

### Manual Testing Scenarios

### Basic Shopping Flow
1. Browse products without authentication
2. Login as customer (`user@test.com` / `user123`)
3. Add products to cart
4. Proceed to checkout
5. Complete order
6. View order history

### Admin Management Flow
1. Login as admin (`admin@test.com` / `admin123`)
2. Access admin dashboard
3. Create/edit/delete products
4. View all orders and update statuses
5. Monitor system statistics

### Error Handling Testing
- Try adding more items than in stock
- Attempt unauthorized admin actions as customer
- Test with expired sessions
- Simulate network errors

### Data Management
```typescript
import { api } from '@/lib/api-client';

// Reset all data to initial state
await api.resetData();

// This clears:
// - All orders
// - All user carts
// - Resets products to sample data
// - Logs out all users
```

## Development Guide

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components (pre-installed)
│   ├── Header.tsx      # Navigation header
│   ├── ProductListing.tsx
│   ├── Cart.tsx
│   └── ...
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state
│   └── CartContext.tsx # Cart state
├── lib/               # Utilities and API
│   ├── api-backend.ts # In-memory API backend
│   ├── api-client.ts  # API client wrapper
│   ├── data.ts        # Sample data
│   └── utils.ts       # Helper functions
├── types/             # TypeScript type definitions
│   └── index.ts
└── App.tsx           # Main application component
```

### Adding New Features

1. **New API Endpoint**
   ```typescript
   // In api-backend.ts
   async newEndpoint(): Promise<ApiResponse<T>> {
     const authCheck = this.validateAuth();
     if (!authCheck.success) return authCheck;
     
     // Implementation here
   }
   
   // In api-client.ts
   static async newEndpoint(): Promise<ApiResponse<T>> {
     return apiBackend.newEndpoint();
   }
   ```

2. **New Component**
   ```typescript
   import { api } from '@/lib/api-client';
   import { useAuth } from '@/contexts/AuthContext';
   
   export function MyComponent() {
     const { user } = useAuth();
     // Component implementation
   }
   ```

### Data Persistence

The application uses `spark.kv` for data persistence:

- **Products**: `api_products`
- **Users**: `api_users`  
- **Orders**: `api_orders`
- **User Carts**: `api_cart_{userId}`
- **Session**: `api_session_token`, `api_current_user`

### Error Handling

All API operations return standardized responses:

```typescript
const result = await api.products.getAll();
if (result.success) {
  console.log('Products:', result.data);
} else {
  console.error('Error:', result.error);
}
```

## Architecture

### In-Memory API Backend

The `InMemoryApiBackend` class provides:
- **Complete REST API simulation**
- **JWT-like authentication**
- **Role-based access control**
- **Data validation and error handling**
- **Session management**
- **Network delay simulation**

### State Management

- **Auth Context**: Manages user authentication state
- **Cart Context**: Manages shopping cart state
- **API Backend**: Centralized data management with persistence
- **React Hooks**: Local component state for UI interactions

### Component Architecture

- **App.tsx**: Main application router and state coordinator
- **Contexts**: Provide global state management
- **Components**: Focused, reusable UI components
- **API Client**: Clean abstraction over backend operations

### Testing Strategy

The architecture supports comprehensive testing:
- **Unit Testing**: Individual components and functions
- **Integration Testing**: API operations and data flows
- **User Flow Testing**: Complete e-commerce scenarios
- **Error Scenario Testing**: Network failures and edge cases

## Troubleshooting

### Common Issues

1. **Data not persisting**: Check that `spark.kv` operations are awaited properly
2. **Authentication errors**: Verify test account credentials
3. **Cart not updating**: Ensure user is logged in before cart operations
4. **Products not loading**: Check network simulation delays

### Debug Utilities

```typescript
// Check authentication status
console.log('Authenticated:', api.isAuthenticated());

// Reset all data
await api.resetData();

// Check current user
const user = await api.getCurrentUser();
console.log('Current user:', user);
```

### Development Tips

- Use browser dev tools to inspect `spark.kv` data
- Enable console logging for API operations
- Test with both admin and customer accounts
- Use the data reset function frequently during development
- **Use the API Testing Console** for interactive API testing and debugging
- Run automated test suites to verify functionality after changes

### API Testing Console

Access the API Testing Console via the "API Test" navigation link. Features include:

- **Interactive Testing**: Click buttons to test specific API endpoints
- **Configurable Test Data**: Modify credentials, product IDs, and search parameters
- **Real-time Results**: View formatted API responses immediately
- **Comprehensive Coverage**: Test authentication, products, cart, orders, and admin functions
- **Error Scenarios**: Test invalid inputs and unauthorized access
- **Data Management**: Reset data and test different user scenarios

The console is perfect for:
- Debugging API issues
- Learning the API structure
- Testing new features
- Validating error handling
- Performance testing

---

For more information or issues, please refer to the API documentation or create test scenarios using the provided utilities.