import { Product, User, Order, CartItem } from '@/types';
import { sampleProducts, testUsers, calculateCartTotals, generateOrderId } from './data';

// API Response type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

// Authentication token type
export interface AuthToken {
  userId: string;
  email: string;
  role: 'admin' | 'customer';
  expiresAt: number;
}

/**
 * In-Memory API Backend for E-commerce Testing
 * Simulates a complete REST API with authentication, CRUD operations, and session management
 */
export class InMemoryApiBackend {
  private currentUser: AuthToken | null = null;
  private sessionToken: string | null = null;

  constructor() {
    this.initializeData();
    this.loadSession();
  }

  /**
   * Initialize default data if not present in storage
   */
  private async initializeData() {
    try {
      // Initialize products if not present
      const existingProducts = await spark.kv.get<Product[]>('api_products');
      if (!existingProducts) {
        await spark.kv.set('api_products', [...sampleProducts]);
      }

      // Initialize users if not present
      const existingUsers = await spark.kv.get<User[]>('api_users');
      if (!existingUsers) {
        await spark.kv.set('api_users', [...testUsers]);
      }

      // Initialize orders if not present
      const existingOrders = await spark.kv.get<Order[]>('api_orders');
      if (!existingOrders) {
        await spark.kv.set('api_orders', []);
      }
    } catch (error) {
      console.error('Failed to initialize API data:', error);
    }
  }

  /**
   * Load user session from storage
   */
  private async loadSession() {
    try {
      const token = await spark.kv.get<string>('api_session_token');
      const user = await spark.kv.get<AuthToken>('api_current_user');
      
      if (token && user && user.expiresAt > Date.now()) {
        this.sessionToken = token;
        this.currentUser = user;
      } else {
        // Clear expired session
        await this.clearSession();
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  }

  /**
   * Save user session to storage
   */
  private async saveSession(user: AuthToken, token: string) {
    try {
      await spark.kv.set('api_session_token', token);
      await spark.kv.set('api_current_user', user);
      this.sessionToken = token;
      this.currentUser = user;
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  /**
   * Clear user session
   */
  private async clearSession() {
    try {
      await spark.kv.delete('api_session_token');
      await spark.kv.delete('api_current_user');
      this.sessionToken = null;
      this.currentUser = null;
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }

  /**
   * Generate a mock JWT token
   */
  private generateToken(user: User): string {
    return `mock_jwt_${user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate authentication token
   */
  private validateAuth(requireAdmin = false): ApiResponse {
    if (!this.currentUser || !this.sessionToken) {
      return {
        success: false,
        error: 'Authentication required'
      };
    }

    if (this.currentUser.expiresAt <= Date.now()) {
      this.clearSession();
      return {
        success: false,
        error: 'Session expired'
      };
    }

    if (requireAdmin && this.currentUser.role !== 'admin') {
      return {
        success: false,
        error: 'Admin access required'
      };
    }

    return { success: true };
  }

  /**
   * Simulate network delay for realistic testing
   */
  private async simulateDelay(ms: number = 100) {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  // =============================================================================
  // AUTHENTICATION API
  // =============================================================================

  /**
   * POST /api/auth/login
   */
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    await this.simulateDelay(300);

    try {
      const users = await spark.kv.get<User[]>('api_users') || [];
      const user = users.find(u => u.email === email);

      if (!user) {
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      // Simple password validation (for testing only)
      const validPassword = (email === 'admin@test.com' && password === 'admin123') ||
                           (email === 'user@test.com' && password === 'user123');

      if (!validPassword) {
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      const token = this.generateToken(user);
      const authToken: AuthToken = {
        userId: user.id,
        email: user.email,
        role: user.role,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };

      await this.saveSession(authToken, token);

      return {
        success: true,
        data: { user, token },
        message: 'Login successful'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Login failed'
      };
    }
  }

  /**
   * POST /api/auth/logout
   */
  async logout(): Promise<ApiResponse> {
    await this.simulateDelay(100);
    await this.clearSession();
    
    return {
      success: true,
      message: 'Logout successful'
    };
  }

  /**
   * GET /api/auth/me
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    await this.simulateDelay(100);
    
    const authCheck = this.validateAuth();
    if (!authCheck.success) {
      return authCheck;
    }

    try {
      const users = await spark.kv.get<User[]>('api_users') || [];
      const user = users.find(u => u.id === this.currentUser!.userId);

      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        data: user
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get user'
      };
    }
  }

  // =============================================================================
  // PRODUCTS API
  // =============================================================================

  /**
   * GET /api/products
   */
  async getProducts(params: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<ApiResponse<Product[]>> {
    await this.simulateDelay(200);

    try {
      const products = await spark.kv.get<Product[]>('api_products') || [];
      let filtered = [...products];

      // Apply search filter
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
        );
      }

      // Apply category filter
      if (params.category && params.category !== 'All') {
        filtered = filtered.filter(product => product.category === params.category);
      }

      // Apply pagination
      const page = params.page || 1;
      const limit = params.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = filtered.slice(startIndex, endIndex);

      return {
        success: true,
        data: paginatedProducts,
        pagination: {
          page,
          limit,
          total: filtered.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch products'
      };
    }
  }

  /**
   * GET /api/products/:id
   */
  async getProduct(id: string): Promise<ApiResponse<Product>> {
    await this.simulateDelay(150);

    try {
      const products = await spark.kv.get<Product[]>('api_products') || [];
      const product = products.find(p => p.id === id);

      if (!product) {
        return {
          success: false,
          error: 'Product not found'
        };
      }

      return {
        success: true,
        data: product
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch product'
      };
    }
  }

  /**
   * POST /api/products (Admin only)
   */
  async createProduct(productData: Omit<Product, 'id'>): Promise<ApiResponse<Product>> {
    await this.simulateDelay(300);

    const authCheck = this.validateAuth(true);
    if (!authCheck.success) {
      return authCheck;
    }

    try {
      const products = await spark.kv.get<Product[]>('api_products') || [];
      const newProduct: Product = {
        ...productData,
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      products.push(newProduct);
      await spark.kv.set('api_products', products);

      return {
        success: true,
        data: newProduct,
        message: 'Product created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create product'
      };
    }
  }

  /**
   * PUT /api/products/:id (Admin only)
   */
  async updateProduct(id: string, updates: Partial<Product>): Promise<ApiResponse<Product>> {
    await this.simulateDelay(300);

    const authCheck = this.validateAuth(true);
    if (!authCheck.success) {
      return authCheck;
    }

    try {
      const products = await spark.kv.get<Product[]>('api_products') || [];
      const productIndex = products.findIndex(p => p.id === id);

      if (productIndex === -1) {
        return {
          success: false,
          error: 'Product not found'
        };
      }

      const updatedProduct = { ...products[productIndex], ...updates, id };
      products[productIndex] = updatedProduct;
      await spark.kv.set('api_products', products);

      return {
        success: true,
        data: updatedProduct,
        message: 'Product updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update product'
      };
    }
  }

  /**
   * DELETE /api/products/:id (Admin only)
   */
  async deleteProduct(id: string): Promise<ApiResponse> {
    await this.simulateDelay(200);

    const authCheck = this.validateAuth(true);
    if (!authCheck.success) {
      return authCheck;
    }

    try {
      const products = await spark.kv.get<Product[]>('api_products') || [];
      const filteredProducts = products.filter(p => p.id !== id);

      if (filteredProducts.length === products.length) {
        return {
          success: false,
          error: 'Product not found'
        };
      }

      await spark.kv.set('api_products', filteredProducts);

      return {
        success: true,
        message: 'Product deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete product'
      };
    }
  }

  // =============================================================================
  // CART API
  // =============================================================================

  /**
   * GET /api/cart
   */
  async getCart(): Promise<ApiResponse<{ items: CartItem[]; totals: any }>> {
    await this.simulateDelay(150);

    const authCheck = this.validateAuth();
    if (!authCheck.success) {
      return authCheck;
    }

    try {
      const cartKey = `api_cart_${this.currentUser!.userId}`;
      const cartItems = await spark.kv.get<CartItem[]>(cartKey) || [];
      const totals = calculateCartTotals(cartItems);

      return {
        success: true,
        data: {
          items: cartItems,
          totals
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch cart'
      };
    }
  }

  /**
   * POST /api/cart/add
   */
  async addToCart(productId: string, quantity: number = 1): Promise<ApiResponse> {
    await this.simulateDelay(200);

    const authCheck = this.validateAuth();
    if (!authCheck.success) {
      return authCheck;
    }

    try {
      // Check if product exists and has sufficient stock
      const products = await spark.kv.get<Product[]>('api_products') || [];
      const product = products.find(p => p.id === productId);

      if (!product) {
        return {
          success: false,
          error: 'Product not found'
        };
      }

      if (product.stock < quantity) {
        return {
          success: false,
          error: 'Insufficient stock'
        };
      }

      const cartKey = `api_cart_${this.currentUser!.userId}`;
      const cartItems = await spark.kv.get<CartItem[]>(cartKey) || [];
      
      const existingItemIndex = cartItems.findIndex(item => item.productId === productId);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const newQuantity = cartItems[existingItemIndex].quantity + quantity;
        if (newQuantity > product.stock) {
          return {
            success: false,
            error: 'Insufficient stock'
          };
        }
        cartItems[existingItemIndex].quantity = newQuantity;
      } else {
        // Add new item
        cartItems.push({
          productId,
          quantity,
          price: product.price
        });
      }

      await spark.kv.set(cartKey, cartItems);

      return {
        success: true,
        message: 'Item added to cart'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to add item to cart'
      };
    }
  }

  /**
   * PUT /api/cart/update/:productId
   */
  async updateCartItem(productId: string, quantity: number): Promise<ApiResponse> {
    await this.simulateDelay(200);

    const authCheck = this.validateAuth();
    if (!authCheck.success) {
      return authCheck;
    }

    try {
      if (quantity <= 0) {
        return this.removeFromCart(productId);
      }

      // Check stock availability
      const products = await spark.kv.get<Product[]>('api_products') || [];
      const product = products.find(p => p.id === productId);

      if (!product) {
        return {
          success: false,
          error: 'Product not found'
        };
      }

      if (product.stock < quantity) {
        return {
          success: false,
          error: 'Insufficient stock'
        };
      }

      const cartKey = `api_cart_${this.currentUser!.userId}`;
      const cartItems = await spark.kv.get<CartItem[]>(cartKey) || [];
      
      const itemIndex = cartItems.findIndex(item => item.productId === productId);
      
      if (itemIndex === -1) {
        return {
          success: false,
          error: 'Item not found in cart'
        };
      }

      cartItems[itemIndex].quantity = quantity;
      await spark.kv.set(cartKey, cartItems);

      return {
        success: true,
        message: 'Cart updated'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update cart'
      };
    }
  }

  /**
   * DELETE /api/cart/remove/:productId
   */
  async removeFromCart(productId: string): Promise<ApiResponse> {
    await this.simulateDelay(150);

    const authCheck = this.validateAuth();
    if (!authCheck.success) {
      return authCheck;
    }

    try {
      const cartKey = `api_cart_${this.currentUser!.userId}`;
      const cartItems = await spark.kv.get<CartItem[]>(cartKey) || [];
      
      const filteredItems = cartItems.filter(item => item.productId !== productId);
      await spark.kv.set(cartKey, filteredItems);

      return {
        success: true,
        message: 'Item removed from cart'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to remove item'
      };
    }
  }

  /**
   * DELETE /api/cart/clear
   */
  async clearCart(): Promise<ApiResponse> {
    await this.simulateDelay(100);

    const authCheck = this.validateAuth();
    if (!authCheck.success) {
      return authCheck;
    }

    try {
      const cartKey = `api_cart_${this.currentUser!.userId}`;
      await spark.kv.set(cartKey, []);

      return {
        success: true,
        message: 'Cart cleared'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to clear cart'
      };
    }
  }

  // =============================================================================
  // ORDERS API
  // =============================================================================

  /**
   * GET /api/orders
   */
  async getOrders(): Promise<ApiResponse<Order[]>> {
    await this.simulateDelay(200);

    const authCheck = this.validateAuth();
    if (!authCheck.success) {
      return authCheck;
    }

    try {
      const orders = await spark.kv.get<Order[]>('api_orders') || [];
      const userOrders = orders.filter(order => order.userId === this.currentUser!.userId);

      return {
        success: true,
        data: userOrders
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch orders'
      };
    }
  }

  /**
   * GET /api/orders/:id
   */
  async getOrder(orderId: string): Promise<ApiResponse<Order>> {
    await this.simulateDelay(150);

    const authCheck = this.validateAuth();
    if (!authCheck.success) {
      return authCheck;
    }

    try {
      const orders = await spark.kv.get<Order[]>('api_orders') || [];
      const order = orders.find(o => o.id === orderId);

      if (!order) {
        return {
          success: false,
          error: 'Order not found'
        };
      }

      // Check if user owns this order (or is admin)
      if (order.userId !== this.currentUser!.userId && this.currentUser!.role !== 'admin') {
        return {
          success: false,
          error: 'Access denied'
        };
      }

      return {
        success: true,
        data: order
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch order'
      };
    }
  }

  /**
   * POST /api/orders
   */
  async createOrder(): Promise<ApiResponse<Order>> {
    await this.simulateDelay(400);

    const authCheck = this.validateAuth();
    if (!authCheck.success) {
      return authCheck;
    }

    try {
      // Get current cart
      const cartKey = `api_cart_${this.currentUser!.userId}`;
      const cartItems = await spark.kv.get<CartItem[]>(cartKey) || [];

      if (cartItems.length === 0) {
        return {
          success: false,
          error: 'Cart is empty'
        };
      }

      // Validate stock and calculate totals
      const products = await spark.kv.get<Product[]>('api_products') || [];
      for (const cartItem of cartItems) {
        const product = products.find(p => p.id === cartItem.productId);
        if (!product || product.stock < cartItem.quantity) {
          return {
            success: false,
            error: `Insufficient stock for ${product?.name || 'product'}`
          };
        }
      }

      const totals = calculateCartTotals(cartItems);
      const newOrder: Order = {
        id: generateOrderId(),
        userId: this.currentUser!.userId,
        items: [...cartItems],
        subtotal: totals.subtotal,
        tax: totals.tax,
        shipping: totals.shipping,
        total: totals.total,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Update product stock
      for (const cartItem of cartItems) {
        const productIndex = products.findIndex(p => p.id === cartItem.productId);
        if (productIndex >= 0) {
          products[productIndex].stock -= cartItem.quantity;
        }
      }

      // Save order and updated products
      const orders = await spark.kv.get<Order[]>('api_orders') || [];
      orders.push(newOrder);
      
      await spark.kv.set('api_orders', orders);
      await spark.kv.set('api_products', products);
      
      // Clear cart
      await spark.kv.set(cartKey, []);

      return {
        success: true,
        data: newOrder,
        message: 'Order created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create order'
      };
    }
  }

  /**
   * PUT /api/orders/:id/status (Admin only)
   */
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<ApiResponse<Order>> {
    await this.simulateDelay(200);

    const authCheck = this.validateAuth(true);
    if (!authCheck.success) {
      return authCheck;
    }

    try {
      const orders = await spark.kv.get<Order[]>('api_orders') || [];
      const orderIndex = orders.findIndex(o => o.id === orderId);

      if (orderIndex === -1) {
        return {
          success: false,
          error: 'Order not found'
        };
      }

      orders[orderIndex].status = status;
      await spark.kv.set('api_orders', orders);

      return {
        success: true,
        data: orders[orderIndex],
        message: 'Order status updated'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update order status'
      };
    }
  }

  // =============================================================================
  // ADMIN API
  // =============================================================================

  /**
   * GET /api/admin/orders (Admin only)
   */
  async getAllOrders(): Promise<ApiResponse<Order[]>> {
    await this.simulateDelay(300);

    const authCheck = this.validateAuth(true);
    if (!authCheck.success) {
      return authCheck;
    }

    try {
      const orders = await spark.kv.get<Order[]>('api_orders') || [];
      return {
        success: true,
        data: orders
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch orders'
      };
    }
  }

  /**
   * GET /api/admin/users (Admin only)
   */
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    await this.simulateDelay(200);

    const authCheck = this.validateAuth(true);
    if (!authCheck.success) {
      return authCheck;
    }

    try {
      const users = await spark.kv.get<User[]>('api_users') || [];
      return {
        success: true,
        data: users
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch users'
      };
    }
  }

  /**
   * GET /api/admin/stats (Admin only)
   */
  async getStats(): Promise<ApiResponse<any>> {
    await this.simulateDelay(250);

    const authCheck = this.validateAuth(true);
    if (!authCheck.success) {
      return authCheck;
    }

    try {
      const products = await spark.kv.get<Product[]>('api_products') || [];
      const orders = await spark.kv.get<Order[]>('api_orders') || [];
      const users = await spark.kv.get<User[]>('api_users') || [];

      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const totalProducts = products.length;
      const totalOrders = orders.length;
      const totalUsers = users.length;
      const lowStockProducts = products.filter(p => p.stock < 5).length;

      return {
        success: true,
        data: {
          totalRevenue,
          totalProducts,
          totalOrders,
          totalUsers,
          lowStockProducts,
          recentOrders: orders.slice(-5).reverse()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch stats'
      };
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  /**
   * Reset all data to initial state (for testing)
   */
  async resetData(): Promise<ApiResponse> {
    try {
      await spark.kv.set('api_products', [...sampleProducts]);
      await spark.kv.set('api_users', [...testUsers]);
      await spark.kv.set('api_orders', []);
      
      // Clear all user carts
      const allKeys = await spark.kv.keys();
      const cartKeys = allKeys.filter(key => key.startsWith('api_cart_'));
      for (const key of cartKeys) {
        await spark.kv.delete(key);
      }

      await this.clearSession();

      return {
        success: true,
        message: 'Data reset successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to reset data'
      };
    }
  }

  /**
   * Get current authentication status
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null && this.sessionToken !== null;
  }

  /**
   * Get current user info
   */
  getCurrentUserInfo(): AuthToken | null {
    return this.currentUser;
  }
}

// Create singleton instance
export const apiBackend = new InMemoryApiBackend();