import { apiBackend, ApiResponse } from './api-backend';
import { Product, User, Order, CartItem } from '@/types';

/**
 * API Client for E-commerce Application
 * Provides a clean interface to interact with the in-memory API backend
 */
export class ApiClient {
  // =============================================================================
  // AUTHENTICATION
  // =============================================================================
  
  static async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    return apiBackend.login(email, password);
  }

  static async logout(): Promise<ApiResponse> {
    return apiBackend.logout();
  }

  static async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiBackend.getCurrentUser();
  }

  static isAuthenticated(): boolean {
    return apiBackend.isAuthenticated();
  }

  // =============================================================================
  // PRODUCTS
  // =============================================================================

  static async getProducts(params: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<ApiResponse<Product[]>> {
    return apiBackend.getProducts(params);
  }

  static async getProduct(id: string): Promise<ApiResponse<Product>> {
    return apiBackend.getProduct(id);
  }

  static async createProduct(productData: Omit<Product, 'id'>): Promise<ApiResponse<Product>> {
    return apiBackend.createProduct(productData);
  }

  static async updateProduct(id: string, updates: Partial<Product>): Promise<ApiResponse<Product>> {
    return apiBackend.updateProduct(id, updates);
  }

  static async deleteProduct(id: string): Promise<ApiResponse> {
    return apiBackend.deleteProduct(id);
  }

  // =============================================================================
  // CART
  // =============================================================================

  static async getCart(): Promise<ApiResponse<{ items: CartItem[]; totals: any }>> {
    return apiBackend.getCart();
  }

  static async addToCart(productId: string, quantity: number = 1): Promise<ApiResponse> {
    return apiBackend.addToCart(productId, quantity);
  }

  static async updateCartItem(productId: string, quantity: number): Promise<ApiResponse> {
    return apiBackend.updateCartItem(productId, quantity);
  }

  static async removeFromCart(productId: string): Promise<ApiResponse> {
    return apiBackend.removeFromCart(productId);
  }

  static async clearCart(): Promise<ApiResponse> {
    return apiBackend.clearCart();
  }

  // =============================================================================
  // ORDERS
  // =============================================================================

  static async getOrders(): Promise<ApiResponse<Order[]>> {
    return apiBackend.getOrders();
  }

  static async getOrder(orderId: string): Promise<ApiResponse<Order>> {
    return apiBackend.getOrder(orderId);
  }

  static async createOrder(): Promise<ApiResponse<Order>> {
    return apiBackend.createOrder();
  }

  static async updateOrderStatus(orderId: string, status: Order['status']): Promise<ApiResponse<Order>> {
    return apiBackend.updateOrderStatus(orderId, status);
  }

  // =============================================================================
  // ADMIN
  // =============================================================================

  static async getAllOrders(): Promise<ApiResponse<Order[]>> {
    return apiBackend.getAllOrders();
  }

  static async getAllUsers(): Promise<ApiResponse<User[]>> {
    return apiBackend.getAllUsers();
  }

  static async getStats(): Promise<ApiResponse<any>> {
    return apiBackend.getStats();
  }

  // =============================================================================
  // UTILITIES
  // =============================================================================

  static async resetData(): Promise<ApiResponse> {
    return apiBackend.resetData();
  }
}

// Convenience functions for common operations
export const api = {
  // Auth shortcuts
  login: ApiClient.login,
  logout: ApiClient.logout,
  getCurrentUser: ApiClient.getCurrentUser,
  isAuthenticated: ApiClient.isAuthenticated,

  // Product shortcuts
  products: {
    getAll: ApiClient.getProducts,
    getById: ApiClient.getProduct,
    create: ApiClient.createProduct,
    update: ApiClient.updateProduct,
    delete: ApiClient.deleteProduct,
  },

  // Cart shortcuts
  cart: {
    get: ApiClient.getCart,
    add: ApiClient.addToCart,
    update: ApiClient.updateCartItem,
    remove: ApiClient.removeFromCart,
    clear: ApiClient.clearCart,
  },

  // Order shortcuts
  orders: {
    getAll: ApiClient.getOrders,
    getById: ApiClient.getOrder,
    create: ApiClient.createOrder,
    updateStatus: ApiClient.updateOrderStatus,
  },
  
  // Admin shortcuts
  admin: {
    orders: ApiClient.getAllOrders,
    users: ApiClient.getAllUsers,
    stats: ApiClient.getStats,
  },

  // Utility shortcuts
  resetData: ApiClient.resetData,
};

export default ApiClient;