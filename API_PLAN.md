# In-Memory API Backend Design Plan

## Overview

This document outlines the design and implementation of a comprehensive in-memory API backend for the e-commerce testing application. The backend simulates a real REST API without requiring external databases or services.

## Architecture Principles

### 1. RESTful Design
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Proper HTTP status codes
- Consistent URL structure
- JSON request/response format

### 2. Stateful Memory Storage
- In-memory data storage using JavaScript objects/arrays
- Session-based authentication
- Automatic data persistence during app session
- Reset capability for testing

### 3. Realistic API Behavior
- Request validation
- Error handling with proper status codes
- Rate limiting simulation
- Async responses with realistic delays

## Data Models

### Core Entities

#### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  createdAt: string;
}
```

#### Product
```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}
```

#### Cart Item
```typescript
interface CartItem {
  productId: string;
  quantity: number;
  price: number; // Price at time of adding to cart
}
```

#### Order
```typescript
interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  updatedAt: string;
}
```

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/login
**Purpose**: Authenticate user and create session
**Request Body**:
```json
{
  "email": "user@test.com",
  "password": "user123"
}
```
**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "user": { /* User object */ },
    "token": "jwt-token-here"
  }
}
```
**Error Response** (401):
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

#### POST /api/auth/logout
**Purpose**: End user session
**Success Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET /api/auth/me
**Purpose**: Get current authenticated user
**Success Response** (200):
```json
{
  "success": true,
  "data": { /* User object */ }
}
```

### Product Endpoints

#### GET /api/products
**Purpose**: Get products with optional filtering
**Query Parameters**:
- `search`: Text search in product name/description
- `category`: Filter by product category
- `page`: Pagination page number (default: 1)
- `limit`: Items per page (default: 20)

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    { /* Product objects */ }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

#### GET /api/products/{id}
**Purpose**: Get single product by ID
**Success Response** (200):
```json
{
  "success": true,
  "data": { /* Product object */ }
}
```

#### POST /api/products (Admin Only)
**Purpose**: Create new product
**Request Body**:
```json
{
  "name": "New Product",
  "price": 99.99,
  "description": "Product description",
  "image": "image-url",
  "category": "Electronics",
  "stock": 10
}
```

#### PUT /api/products/{id} (Admin Only)
**Purpose**: Update existing product
**Request Body**: Partial product data

#### DELETE /api/products/{id} (Admin Only)
**Purpose**: Delete product
**Success Response** (200):
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### Cart Endpoints

#### GET /api/cart
**Purpose**: Get user's current cart
**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "productId": "1",
        "quantity": 2,
        "price": 99.99,
        "product": { /* Product object */ }
      }
    ],
    "totals": {
      "subtotal": 199.98,
      "tax": 20.00,
      "shipping": 10.00,
      "total": 229.98
    }
  }
}
```

#### POST /api/cart/add
**Purpose**: Add item to cart
**Request Body**:
```json
{
  "productId": "1",
  "quantity": 2
}
```

#### PUT /api/cart/update
**Purpose**: Update cart item quantity
**Request Body**:
```json
{
  "productId": "1",
  "quantity": 3
}
```

#### DELETE /api/cart/remove
**Purpose**: Remove item from cart
**Request Body**:
```json
{
  "productId": "1"
}
```

#### DELETE /api/cart/clear
**Purpose**: Clear entire cart
**Success Response** (200):
```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

### Order Endpoints

#### GET /api/orders
**Purpose**: Get user's order history
**Success Response** (200):
```json
{
  "success": true,
  "data": [
    { /* Order objects */ }
  ]
}
```

#### GET /api/orders/{id}
**Purpose**: Get specific order details
**Success Response** (200):
```json
{
  "success": true,
  "data": { /* Order object with full details */ }
}
```

#### POST /api/orders
**Purpose**: Create order from current cart
**Success Response** (201):
```json
{
  "success": true,
  "data": { /* New order object */ }
}
```

#### PUT /api/orders/{id}/status (Admin Only)
**Purpose**: Update order status
**Request Body**:
```json
{
  "status": "shipped"
}
```

### Admin Endpoints

#### GET /api/admin/orders
**Purpose**: Get all orders in system
**Success Response** (200):
```json
{
  "success": true,
  "data": [
    { /* All order objects with user info */ }
  ]
}
```

#### GET /api/admin/users
**Purpose**: Get all users in system
**Success Response** (200):
```json
{
  "success": true,
  "data": [
    { /* User objects */ }
  ]
}
```

#### GET /api/admin/stats
**Purpose**: Get application statistics
**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "totalUsers": 2,
    "totalProducts": 15,
    "totalOrders": 8,
    "totalRevenue": 1234.56,
    "averageOrderValue": 154.32
  }
}
```

### Utility Endpoints

#### POST /api/reset
**Purpose**: Reset all data to initial state
**Success Response** (200):
```json
{
  "success": true,
  "message": "Data reset successfully"
}
```

## Implementation Details

### Authentication System
- JWT-like token simulation using random strings
- Session storage in memory with user mapping
- Automatic session expiration (configurable)
- Role-based access control

### Data Storage
- JavaScript Map/Set objects for efficient lookups
- In-memory arrays for ordered data
- Automatic ID generation using UUIDs or incrementing numbers
- Reference integrity between related entities

### Error Handling
- Standardized error response format
- Proper HTTP status codes
- Validation error details
- Rate limiting simulation

### Performance Simulation
- Configurable response delays
- Pagination for large datasets
- Search optimization
- Caching simulation

## Testing Strategy

### Unit Tests
- Individual endpoint functionality
- Authentication flow
- Data validation
- Error scenarios

### Integration Tests
- End-to-end user flows
- Cart-to-order conversion
- Admin operations
- API client integration

### Load Testing
- Multiple concurrent users
- Large dataset handling
- Memory usage monitoring
- Performance benchmarks

## Development Workflow

### 1. Backend Implementation
- Implement core API backend class
- Add authentication system
- Create data storage layer
- Implement all endpoints
- Add error handling

### 2. Client Integration
- Update API client to use backend
- Test all endpoints
- Handle authentication flow
- Implement error handling

### 3. UI Integration
- Connect components to API
- Update state management
- Add loading states
- Implement error displays

### 4. Testing Interface
- Create API testing component
- Add endpoint documentation
- Implement request/response viewer
- Add testing scenarios

## Future Enhancements

### Advanced Features
- File upload simulation
- WebSocket notifications
- Rate limiting
- API versioning
- Request logging
- Performance metrics

### Data Features
- Complex queries
- Data relationships
- Bulk operations
- Data export/import
- Backup/restore

This comprehensive plan ensures a realistic and fully functional API backend that can support all e-commerce operations while maintaining simplicity for testing and development purposes.