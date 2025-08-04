# E-commerce Testing Application

A comprehensive e-commerce web application built with React, TypeScript, and an in-memory API backend for testing and development purposes.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

## 📋 Features

### Core Functionality
- **Product Catalog**: Browse and search products across multiple categories
- **Shopping Cart**: Add, remove, and update items with persistent storage
- **User Authentication**: Login/logout with test user accounts
- **Order Management**: Create and track orders
- **Admin Dashboard**: Administrative interface for managing products and orders
- **API Testing**: Built-in API testing interface

### Technology Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context + Custom Hooks
- **Data Persistence**: Spark KV storage system
- **Icons**: Phosphor Icons
- **Notifications**: Sonner

## 🔐 Test Accounts

The application includes pre-configured test accounts:

### Admin Account
- **Email**: `admin@test.com`
- **Password**: `admin123`
- **Role**: Administrator (access to admin dashboard)

### Customer Account
- **Email**: `user@test.com`
- **Password**: `user123`
- **Role**: Customer

## 🛠 In-Memory API Backend

The application includes a fully functional in-memory API backend that simulates a real e-commerce API without requiring external services.

### API Features
- **RESTful Design**: Standard REST endpoints with proper HTTP methods
- **Authentication**: JWT-based authentication with session management
- **Data Validation**: Input validation and error handling
- **Realistic Responses**: Proper HTTP status codes and response formats
- **Automatic Data Reset**: Fresh data on application restart

### Available Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

#### Products
- `GET /api/products` - Get all products (supports search and category filters)
- `GET /api/products/{id}` - Get specific product
- `POST /api/products` - Create new product (admin only)
- `PUT /api/products/{id}` - Update product (admin only)
- `DELETE /api/products/{id}` - Delete product (admin only)

#### Cart Management
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

#### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/{id}` - Get specific order
- `POST /api/orders` - Create order from cart
- `PUT /api/orders/{id}/status` - Update order status (admin only)

#### Admin Endpoints
- `GET /api/admin/orders` - Get all orders (admin only)
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/stats` - Get application statistics (admin only)

#### Utility
- `POST /api/reset` - Reset all data to initial state

## 🧪 API Testing

The application includes a built-in API testing interface accessible from the main navigation. This allows you to:

- Test all API endpoints with real data
- View request/response details
- Experiment with different parameters
- Verify authentication workflows
- Debug API behavior

### Using the API Testing Interface

1. Navigate to "API Test" in the main menu
2. Select an endpoint from the available categories
3. Fill in required parameters (authentication handled automatically)
4. Click "Test" to execute the request
5. View the detailed response including status codes and data

## 🏗 Application Architecture

### Frontend Structure
```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Main navigation
│   ├── ProductCard.tsx # Product display component
│   └── ...
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state
│   └── CartContext.tsx # Shopping cart state
├── lib/               # Utilities and data
│   ├── api-backend.ts # In-memory API implementation
│   ├── api-client.ts  # API client interface
│   ├── data.ts        # Sample data and utilities
│   └── utils.ts       # Helper functions
├── types/             # TypeScript type definitions
└── App.tsx           # Main application component
```

### State Management
- **Authentication**: Context-based user session management
- **Shopping Cart**: Persistent cart state using Spark KV storage
- **API Client**: Centralized API communication layer
- **Local State**: Component-level state for UI interactions

## 🔄 Data Flow

1. **User Actions**: UI interactions trigger state updates
2. **API Calls**: State changes communicate with in-memory backend
3. **Data Updates**: Backend processes requests and updates data
4. **UI Refresh**: React components re-render with new data
5. **Persistence**: Important data (cart, user session) persists across sessions

## 🧭 Navigation

The application uses a single-page application (SPA) approach with client-side routing:

- **Home**: Product showcase and featured items
- **Products**: Full product catalog with search and filtering
- **Cart**: Shopping cart management (via slide-out panel)
- **Orders**: Order history (authenticated users only)
- **Admin**: Administrative dashboard (admin users only)
- **API Test**: Interactive API testing interface

## 🎨 Styling and Theme

The application uses a custom design system built on Tailwind CSS:

- **Modern Design**: Clean, minimalist interface
- **Responsive**: Mobile-first responsive design
- **Consistent**: Unified color scheme and spacing
- **Accessible**: WCAG-compliant contrast ratios
- **Interactive**: Smooth animations and transitions

### Color Scheme
- **Primary**: Deep blue for main actions and navigation
- **Secondary**: Light gray for supporting elements
- **Accent**: Orange for highlights and call-to-action items
- **Background**: Clean white with subtle gray cards
- **Text**: Dark blue-gray for optimal readability

## 🚦 Error Handling

The application includes comprehensive error handling:

- **API Errors**: Graceful handling of backend failures
- **Validation**: Client-side input validation
- **Notifications**: User-friendly error messages
- **Fallbacks**: Sensible defaults for missing data
- **Debugging**: Console logging for development

## 🔍 Testing and Development

### Manual Testing Scenarios

1. **User Registration Flow**
   - Test login with provided credentials
   - Verify session persistence
   - Test logout functionality

2. **Shopping Experience**
   - Browse products and categories
   - Add items to cart
   - Modify cart quantities
   - Complete checkout process

3. **Admin Functions**
   - Access admin dashboard
   - View all orders and users
   - Test product management

4. **API Functionality**
   - Use API testing interface
   - Verify all endpoints
   - Test error scenarios

### Development Notes

- **Hot Reload**: Vite provides instant reload during development
- **TypeScript**: Full type safety throughout the application
- **Component Library**: Reusable UI components with shadcn/ui
- **Code Organization**: Clear separation of concerns
- **Performance**: Optimized React patterns and minimal re-renders

## 📦 Deployment

The application is designed to be deployed as a static site:

```bash
npm run build
npm run preview
```

The built application in the `dist` folder can be deployed to any static hosting service.

## 🤝 Contributing

This is a testing and educational application. To extend functionality:

1. Add new API endpoints in `src/lib/api-backend.ts`
2. Create corresponding client methods in `src/lib/api-client.ts`
3. Build UI components using the existing design system
4. Test new features using the built-in API testing interface

## 📄 License

This project is created for testing and educational purposes.