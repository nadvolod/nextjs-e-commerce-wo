# API Documentation - E-commerce Testing Application

## Overview

This document provides comprehensive documentation for the in-memory API backend used in the e-commerce testing application. The API simulates a complete REST backend with authentication, data persistence, and all standard e-commerce operations.

## Base URL
The API is available through the `api` client interface:
```typescript
import { api } from '@/lib/api-client';
```

## Authentication

All authenticated endpoints require a valid session token. The API uses JWT-like token simulation for realistic authentication testing.

### Test Accounts
| Email | Password | Role | Description |
|-------|----------|------|-------------|
| `admin@test.com` | `admin123` | Admin | Full system access including product management |
| `user@test.com` | `user123` | Customer | Standard shopping and order access |

### Session Management
- Tokens expire after 24 hours
- Sessions persist across page refreshes
- Automatic cleanup of expired sessions

## API Response Format

All endpoints return responses in a consistent format:

```typescript
interface ApiResponse<T> {
  success: boolean;        // Request success status
  data?: T;               // Response data (when successful)
  error?: string;         // Error message (when failed)
  message?: string;       // Success/info message
  pagination?: {          // For paginated results
    page: number;
    limit: number;
    total: number;
  };
}
```

## Endpoints

### Authentication

#### POST /api/auth/login
Authenticate user and create session.

**Request:**
```typescript
await api.login(email: string, password: string);
```

**Response:**
```typescript
{
  success: true,
  data: {
    user: {
      id: "1",
      email: "user@test.com",
      name: "Test Customer",
      role: "customer"
    },
    token: "mock_jwt_1_1234567890_abcdef123"
  },
  message: "Login successful"
}
```

**Errors:**
- `400`: Invalid credentials

#### POST /api/auth/logout
End user session.

**Request:**
```typescript
await api.logout();
```

**Response:**
```typescript
{
  success: true,
  message: "Logout successful"
}
```

#### GET /api/auth/me
Get current authenticated user information.

**Request:**
```typescript
await api.getCurrentUser();
```

**Response:**
```typescript
{
  success: true,
  data: {
    id: "1",
    email: "user@test.com",
    name: "Test Customer",
    role: "customer"
  }
}
```

**Errors:**
- `401`: Authentication required
- `401`: Session expired

### Products

#### GET /api/products
Retrieve products with optional filtering and pagination.

**Request:**
```typescript
await api.products.getAll({
  search?: string,      // Search in name and description
  category?: string,    // Filter by category
  page?: number,        // Page number (default: 1)
  limit?: number        // Items per page (default: 20)
});
```

**Response:**
```typescript
{
  success: true,
  data: [
    {
      id: "1",
      name: "Wireless Bluetooth Headphones",
      price: 99.99,
      description: "Premium quality wireless headphones...",
      image: "https://images.unsplash.com/...",
      category: "Electronics",
      stock: 15
    }
    // ... more products
  ],
  pagination: {
    page: 1,
    limit: 20,
    total: 15
  }
}
```

#### GET /api/products/:id
Get a single product by ID.

**Request:**
```typescript
await api.products.getById(productId: string);
```

**Response:**
```typescript
{
  success: true,
  data: {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 99.99,
    description: "Premium quality wireless headphones...",
    image: "https://images.unsplash.com/...",
    category: "Electronics",
    stock: 15
  }
}
```

**Errors:**
- `404`: Product not found

#### POST /api/products *(Admin Only)*
Create a new product.

**Request:**
```typescript
await api.products.create({
  name: string,
  price: number,
  description: string,
  image: string,
  category: string,
  stock: number
});
```

**Response:**
```typescript
{
  success: true,
  data: {
    id: "16_1234567890_abc123",
    name: "New Product",
    price: 29.99,
    // ... other fields
  },
  message: "Product created successfully"
}
```

**Errors:**
- `401`: Authentication required
- `403`: Admin access required

#### PUT /api/products/:id *(Admin Only)*
Update an existing product.

**Request:**
```typescript
await api.products.update(productId: string, {
  name?: string,
  price?: number,
  description?: string,
  image?: string,
  category?: string,
  stock?: number
});
```

**Response:**
```typescript
{
  success: true,
  data: {
    id: "1",
    name: "Updated Product Name",
    // ... updated fields
  },
  message: "Product updated successfully"
}
```

**Errors:**
- `401`: Authentication required
- `403`: Admin access required
- `404`: Product not found

#### DELETE /api/products/:id *(Admin Only)*
Delete a product.

**Request:**
```typescript
await api.products.delete(productId: string);
```

**Response:**
```typescript
{
  success: true,
  message: "Product deleted successfully"
}
```

**Errors:**
- `401`: Authentication required
- `403`: Admin access required
- `404`: Product not found

### Cart *(Authenticated Only)*

#### GET /api/cart
Get user's current cart with totals.

**Request:**
```typescript
await api.cart.get();
```

**Response:**
```typescript
{
  success: true,
  data: {
    items: [
      {
        productId: "1",
        quantity: 2,
        price: 99.99
      }
    ],
    totals: {
      subtotal: 199.98,
      tax: 15.99,
      shipping: 0,
      total: 215.97
    }
  }
}
```

**Errors:**
- `401`: Authentication required

#### POST /api/cart/add
Add item to cart or update quantity if item exists.

**Request:**
```typescript
await api.cart.add(productId: string, quantity: number = 1);
```

**Response:**
```typescript
{
  success: true,
  message: "Item added to cart"
}
```

**Errors:**
- `401`: Authentication required
- `404`: Product not found
- `400`: Insufficient stock

#### PUT /api/cart/update/:productId
Update item quantity in cart.

**Request:**
```typescript
await api.cart.update(productId: string, quantity: number);
```

**Response:**
```typescript
{
  success: true,
  message: "Cart updated"
}
```

**Errors:**
- `401`: Authentication required
- `404`: Item not found in cart
- `400`: Insufficient stock

#### DELETE /api/cart/remove/:productId
Remove item from cart.

**Request:**
```typescript
await api.cart.remove(productId: string);
```

**Response:**
```typescript
{
  success: true,
  message: "Item removed from cart"
}
```

**Errors:**
- `401`: Authentication required

#### DELETE /api/cart/clear
Empty the entire cart.

**Request:**
```typescript
await api.cart.clear();
```

**Response:**
```typescript
{
  success: true,
  message: "Cart cleared"
}
```

**Errors:**
- `401`: Authentication required

### Orders *(Authenticated Only)*

#### GET /api/orders
Get user's order history.

**Request:**
```typescript
await api.orders.getAll();
```

**Response:**
```typescript
{
  success: true,
  data: [
    {
      id: "ORD-1234567890-AB12",
      userId: "1",
      items: [
        {
          productId: "1",
          quantity: 2,
          price: 99.99
        }
      ],
      subtotal: 199.98,
      tax: 15.99,
      shipping: 0,
      total: 215.97,
      status: "pending",
      createdAt: "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Errors:**
- `401`: Authentication required

#### GET /api/orders/:id
Get specific order details.

**Request:**
```typescript
await api.orders.getById(orderId: string);
```

**Response:**
```typescript
{
  success: true,
  data: {
    id: "ORD-1234567890-AB12",
    userId: "1",
    items: [...],
    subtotal: 199.98,
    tax: 15.99,
    shipping: 0,
    total: 215.97,
    status: "pending",
    createdAt: "2024-01-15T10:30:00.000Z"
  }
}
```

**Errors:**
- `401`: Authentication required
- `404`: Order not found
- `403`: Access denied (not your order)

#### POST /api/orders
Create order from current cart.

**Request:**
```typescript
await api.orders.create();
```

**Response:**
```typescript
{
  success: true,
  data: {
    id: "ORD-1234567890-AB12",
    userId: "1",
    items: [...],
    subtotal: 199.98,
    tax: 15.99,
    shipping: 0,
    total: 215.97,
    status: "pending",
    createdAt: "2024-01-15T10:30:00.000Z"
  },
  message: "Order created successfully"
}
```

**Errors:**
- `401`: Authentication required
- `400`: Cart is empty
- `400`: Insufficient stock for product

#### PUT /api/orders/:id/status *(Admin Only)*
Update order status.

**Request:**
```typescript
await api.orders.updateStatus(orderId: string, status: 'pending' | 'processing' | 'shipped' | 'delivered');
```

**Response:**
```typescript
{
  success: true,
  data: {
    id: "ORD-1234567890-AB12",
    // ... order with updated status
    status: "processing"
  },
  message: "Order status updated"
}
```

**Errors:**
- `401`: Authentication required
- `403`: Admin access required
- `404`: Order not found

### Admin *(Admin Only)*

#### GET /api/admin/orders
Get all orders in the system.

**Request:**
```typescript
await api.admin.orders();
```

**Response:**
```typescript
{
  success: true,
  data: [
    {
      id: "ORD-1234567890-AB12",
      userId: "1",
      // ... full order details
    }
    // ... all orders
  ]
}
```

**Errors:**
- `401`: Authentication required
- `403`: Admin access required

#### GET /api/admin/users
Get all users in the system.

**Request:**
```typescript
await api.admin.users();
```

**Response:**
```typescript
{
  success: true,
  data: [
    {
      id: "1",
      email: "admin@test.com",
      name: "Admin User",
      role: "admin"
    },
    {
      id: "2",
      email: "user@test.com",
      name: "Test Customer",
      role: "customer"
    }
  ]
}
```

**Errors:**
- `401`: Authentication required
- `403`: Admin access required

#### GET /api/admin/stats
Get system statistics and metrics.

**Request:**
```typescript
await api.admin.stats();
```

**Response:**
```typescript
{
  success: true,
  data: {
    totalRevenue: 1234.56,
    totalProducts: 15,
    totalOrders: 42,
    totalUsers: 2,
    lowStockProducts: 3,
    recentOrders: [
      // ... last 5 orders
    ]
  }
}
```

**Errors:**
- `401`: Authentication required
- `403`: Admin access required

### Utilities

#### POST /api/reset
Reset all data to initial state.

**Request:**
```typescript
await api.resetData();
```

**Response:**
```typescript
{
  success: true,
  message: "Data reset successfully"
}
```

This endpoint:
- Resets products to sample data
- Clears all orders
- Clears all user carts
- Logs out all users
- Preserves test user accounts

## Error Handling

### Common Error Responses

#### Authentication Errors
```typescript
{
  success: false,
  error: "Authentication required"
}

{
  success: false,
  error: "Session expired"
}

{
  success: false,
  error: "Admin access required"
}
```

#### Validation Errors
```typescript
{
  success: false,
  error: "Product not found"
}

{
  success: false,
  error: "Insufficient stock"
}

{
  success: false,
  error: "Cart is empty"
}
```

#### Access Errors
```typescript
{
  success: false,
  error: "Access denied"
}

{
  success: false,
  error: "Invalid credentials"
}
```

## Usage Examples

### Complete Shopping Flow
```typescript
// 1. Browse products (no auth required)
const products = await api.products.getAll({ category: 'Electronics' });

// 2. Login
const loginResult = await api.login('user@test.com', 'user123');
if (!loginResult.success) {
  console.error('Login failed:', loginResult.error);
  return;
}

// 3. Add to cart
await api.cart.add('1', 2);
await api.cart.add('4', 1);

// 4. Review cart
const cart = await api.cart.get();
console.log('Cart total:', cart.data.totals.total);

// 5. Create order
const order = await api.orders.create();
console.log('Order created:', order.data.id);

// 6. View orders
const orders = await api.orders.getAll();
```

### Admin Management
```typescript
// Login as admin
await api.login('admin@test.com', 'admin123');

// View system stats
const stats = await api.admin.stats();
console.log('Total revenue:', stats.data.totalRevenue);

// Get all orders
const allOrders = await api.admin.orders();

// Update order status
await api.orders.updateStatus('ORD-123-ABC', 'shipped');

// Create new product
await api.products.create({
  name: 'New Product',
  price: 29.99,
  description: 'A great new product',
  image: 'https://example.com/image.jpg',
  category: 'Electronics',
  stock: 50
});
```

### Error Handling Pattern
```typescript
async function handleApiCall() {
  const result = await api.products.getAll();
  
  if (result.success) {
    console.log('Products:', result.data);
    // Handle success
  } else {
    console.error('Error:', result.error);
    // Handle error - show toast, etc.
  }
}
```

## Testing Features

### Network Delay Simulation
The API includes configurable delays (100-400ms) to simulate realistic network conditions for testing loading states.

### Data Persistence
All data persists across page refreshes using spark.kv storage:
- User sessions
- Cart contents
- Order history
- Product modifications (admin)

### Concurrent Operations
The API handles multiple concurrent operations correctly:
- Stock validation
- Cart updates
- Order creation

### Development Utilities
- Data reset functionality
- Authentication status checking
- Session management
- Debug logging (in development mode)

This API provides a complete testing environment for e-commerce applications without requiring any external dependencies or server setup.