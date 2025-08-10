# NextJS E-commerce Testing Application Prompt

Create a simple e-commerce web application using Next.js 14+ and TypeScript for testing and workshop purposes. The application should be lightweight, self-contained, and require no external dependencies like databases.

## Core Requirements

### Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: React hooks (useState, useContext)
- **Data**: In-memory fake data (no database)

### Application Features

#### 1. Product Catalog

- Display a grid of products with images, names, prices, and descriptions
- Each product should have: id, name, price, description, image URL, category, stock quantity
- Include at least 10-15 sample products across 3-4 categories
- Basic filtering by category
- Simple search functionality

#### 2. Shopping Cart

- Add/remove items from cart
- Update quantities
- Calculate totals (subtotal, tax, shipping, total)
- Persist cart in localStorage
- Cart icon with item count in header
- Mini cart dropdown and full cart page

#### 3. Authentication System

- **UI Authentication**: Simple login form with test users
- **API Authentication**: JWT-based auth for API endpoints
- Test users: `admin@test.com / admin123`, `user@test.com / user123`
- Protected routes and API endpoints
- Basic user roles (admin, customer)

#### 4. REST API Endpoints

Create the following API routes under `/api/`:

**Products**

- `GET /api/products` - Get all products
- `GET /api/products/[id]` - Get single product
- `GET /api/products/category/[category]` - Get products by category

**Cart**

- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove` - Remove item from cart
- `GET /api/cart` - Get user's cart

**Authentication**

- `POST /api/auth/login` - Login endpoint
- `POST /api/auth/logout` - Logout endpoint
- `GET /api/auth/me` - Get current user info

**Orders** (basic)

- `POST /api/orders` - Create order from cart
- `GET /api/orders` - Get user orders

### Technical Specifications

#### Data Structure Examples

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
}

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "customer";
}
```

#### Authentication Requirements

- Use JWT tokens stored in httpOnly cookies
- Middleware to protect API routes
- Client-side auth context for UI state
- Simple login/logout flow
- No password hashing needed (testing only)

#### UI Requirements

- Responsive design (mobile-first)
- Clean, modern interface
- Loading states and error handling
- Toast notifications for actions
- Header with navigation, search, cart icon, user menu

### File Structure

Organize the project with clear separation of concerns:

```
src/
├── app/
│   ├── api/
│   ├── (auth)/
│   ├── cart/
│   ├── products/
│   └── layout.tsx
├── components/
├── lib/
│   ├── auth.ts
│   ├── data.ts
│   └── utils.ts
├── types/
└── middleware.ts
```

### Development Guidelines

- Use TypeScript strict mode
- Implement proper error handling
- Add loading states for async operations
- Include basic input validation
- Use Next.js best practices (SSR/SSG where appropriate)
- Add comments for workshop/learning purposes
- Keep code simple and readable for educational use

### Testing Features

- Include sample data that's easy to modify
- Simple admin panel to view orders
- Debug endpoints for testing purposes
- Easy way to reset cart/data
- Console logging for development

### Deliverables

1. Complete Next.js application with all features
2. README with setup instructions
3. API documentation
4. Sample test scenarios
5. Environment variables template

The application should be ready to run with `npm install` and `npm run dev`, requiring no additional setup or external services.
