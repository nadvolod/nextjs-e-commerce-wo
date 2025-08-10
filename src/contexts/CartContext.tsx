import { createContext, useContext, ReactNode } from 'react';
import { CartItem, Cart } from '@/types';
import { sampleProducts, calculateCartTotals } from '@/lib/data';
// Replace Spark useKV with local implementation
import { useKV } from '@/hooks/useKV';
import { toast } from 'sonner';

interface CartContextType {
  cart: Cart;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useKV<CartItem[]>('shopping-cart', []);

  // Calculate cart totals
  const totals = calculateCartTotals(cartItems);
  const cart: Cart = {
    items: cartItems,
    ...totals
  };

  const addToCart = (productId: string, quantity: number = 1) => {
    const product = sampleProducts.find(p => p.id === productId);
    if (!product) {
      toast.error('Product not found');
      return;
    }

    if (product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }

    setCartItems(currentItems => {
      const existingItem = currentItems.find(item => item.productId === productId);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          toast.error(`Only ${product.stock} items available`);
          return currentItems;
        }
        
        toast.success(`Updated ${product.name} quantity`);
        return currentItems.map(item =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        if (quantity > product.stock) {
          toast.error(`Only ${product.stock} items available`);
          return currentItems;
        }
        
        toast.success(`${product.name} added to cart`);
        return [...currentItems, {
          productId,
          quantity,
          price: product.price
        }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    const product = sampleProducts.find(p => p.id === productId);
    setCartItems(currentItems => {
      const newItems = currentItems.filter(item => item.productId !== productId);
      if (product) {
        toast.success(`${product.name} removed from cart`);
      }
      return newItems;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = sampleProducts.find(p => p.id === productId);
    if (!product) return;

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }

    setCartItems(currentItems =>
      currentItems.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}