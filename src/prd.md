# In-Memory API Backend - E-commerce Testing Application

## Core Purpose & Success
- **Mission Statement**: Create a comprehensive in-memory API backend that enables full testing of e-commerce functionality without external dependencies.
- **Success Indicators**: Complete CRUD operations for products, cart management, user authentication, and order processing with persistent session state.
- **Experience Qualities**: Reliable, fast, and realistic API behavior that mimics production systems.

## Project Classification & Approach
- **Complexity Level**: Light Application with backend simulation
- **Primary User Activity**: Testing and development - enabling comprehensive API testing for e-commerce flows
- **Implementation Strategy**: In-memory data store with session persistence and JWT-like authentication simulation

## Core Problem Analysis
The application needs a realistic backend API for testing purposes that:
- Simulates real API endpoints and responses
- Maintains state during testing sessions
- Provides authentication and authorization
- Handles all CRUD operations for products, cart, users, and orders
- Enables comprehensive testing without external dependencies

## Essential Features

### 1. In-Memory Data Management
- **Products Management**: Full CRUD operations with search and filtering
- **User Management**: Authentication with test accounts and session management
- **Cart Operations**: Add, update, remove items with real-time calculations
- **Order Processing**: Create orders from cart with status tracking
- **Session Persistence**: Maintain state across page refreshes using spark.kv

### 2. Authentication System
- **JWT Simulation**: Token-based authentication with session management
- **User Roles**: Admin and customer role-based access control
- **Protected Routes**: Middleware simulation for API endpoint protection
- **Test Accounts**: Pre-configured test users for different scenarios

### 3. REST API Endpoints
**Products API**
- `GET /api/products` - List all products with filtering and search
- `GET /api/products/:id` - Get single product details
- `GET /api/products/category/:category` - Filter by category
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

**Authentication API**
- `POST /api/auth/login` - User login with credentials
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/register` - User registration (optional)

**Cart API**
- `GET /api/cart` - Get user's current cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:productId` - Update item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Empty cart

**Orders API**
- `GET /api/orders` - Get user's order history
- `GET /api/orders/:id` - Get specific order details
- `POST /api/orders` - Create order from current cart
- `PUT /api/orders/:id/status` - Update order status (admin only)

**Admin API**
- `GET /api/admin/orders` - Get all orders (admin only)
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/stats` - Get system statistics (admin only)

### 4. Error Handling and Validation
- **HTTP Status Codes**: Proper status codes for different scenarios
- **Error Messages**: Descriptive error responses
- **Input Validation**: Validate request data and parameters
- **Authentication Errors**: Handle invalid tokens and unauthorized access

### 5. Testing Features
- **Debug Endpoints**: Special endpoints for testing and debugging
- **Data Reset**: Ability to reset data to initial state
- **Mock Delays**: Simulate network delays for testing loading states
- **Error Simulation**: Endpoints to test error handling

## Implementation Considerations

### Data Storage Strategy
- Use spark.kv for persistent data that survives page refreshes
- Separate storage keys for different data types (products, users, carts, orders)
- Session-based cart management tied to user authentication
- Admin data modifications persist across sessions

### Authentication Implementation
- Simulate JWT tokens using session storage
- Role-based access control for admin vs customer endpoints
- Session timeout handling
- Secure logout functionality

### API Response Format
Standardized response format:
```typescript
{
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}
```

### Performance Considerations
- Efficient in-memory operations
- Pagination for large datasets
- Optimized search and filtering
- Minimal data transfer for mobile testing

## Design Direction

### API Architecture
- **RESTful Design**: Follow REST conventions for predictable API behavior
- **Consistent Responses**: Standardized response format across all endpoints
- **Error Handling**: Comprehensive error responses with helpful messages
- **Documentation**: Clear API documentation with examples

### Testing Integration
- **Mock Data**: Rich sample data for comprehensive testing scenarios
- **Test Scenarios**: Pre-built test cases for different user flows
- **Debug Tools**: Built-in debugging capabilities for development
- **Reset Functionality**: Easy way to reset data for clean testing

## Edge Cases & Problem Scenarios

### Potential Obstacles
- **State Management**: Ensuring data consistency across API calls
- **Authentication**: Managing user sessions and token validation
- **Concurrent Operations**: Handling multiple cart operations
- **Data Persistence**: Maintaining state across page refreshes

### Error Scenarios
- **Invalid Authentication**: Expired or invalid tokens
- **Insufficient Stock**: Handling out-of-stock scenarios
- **Cart Conflicts**: Managing cart state inconsistencies
- **Network Simulation**: Testing offline and slow network conditions

## Implementation Plan

### Phase 1: Core API Infrastructure
1. Set up API router and middleware system
2. Implement authentication and authorization
3. Create base data management layer
4. Set up error handling and validation

### Phase 2: Entity Management
1. Products API with full CRUD operations
2. User management and authentication endpoints
3. Cart operations with real-time calculations
4. Order processing and status management

### Phase 3: Testing Features
1. Admin dashboard API endpoints
2. Debug and testing utilities
3. Data reset and mock scenarios
4. Performance monitoring

### Phase 4: Documentation and Testing
1. Comprehensive API documentation
2. Test scenarios and examples
3. Error handling documentation
4. Usage guidelines and best practices

## Reflection
This in-memory API backend will provide a complete testing environment that simulates real-world e-commerce API behavior while maintaining simplicity and zero external dependencies. The implementation focuses on comprehensive coverage of all e-commerce operations while providing debugging and testing utilities that make development and testing efficient.