import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash } from '@phosphor-icons/react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { sampleProducts, formatCurrency } from '@/lib/data';

interface CartSummaryProps {
  onPageChange: (page: string) => void;
}

export function CartSummary({ onPageChange }: CartSummaryProps) {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="text-4xl mb-4">🛒</div>
        <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground mb-4">Add some products to get started!</p>
        <Button onClick={() => onPageChange('products')} className="w-full">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {cart.items.map((item) => {
          const product = sampleProducts.find(p => p.id === item.productId);
          if (!product) return null;

          return (
            <Card key={item.productId} className="p-4">
              <div className="flex items-start space-x-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{product.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(product.price)} each
                  </p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={12} />
                    </Button>
                    <span className="text-sm font-medium w-8 text-center">
                      {item.quantity}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= product.stock}
                    >
                      <Plus size={12} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFromCart(item.productId)}
                      className="ml-auto text-destructive hover:text-destructive"
                    >
                      <Trash size={14} />
                    </Button>
                  </div>

                  {/* Stock Warning */}
                  {item.quantity >= product.stock && (
                    <Badge variant="destructive" className="mt-1 text-xs">
                      Max stock reached
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Cart Totals */}
      <div className="border-t pt-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(cart.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>{formatCurrency(cart.tax)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>
              {cart.shipping === 0 ? (
                <Badge variant="secondary" className="text-xs">FREE</Badge>
              ) : (
                formatCurrency(cart.shipping)
              )}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-base">
            <span>Total:</span>
            <span>{formatCurrency(cart.total)}</span>
          </div>
          {cart.subtotal < 50 && cart.shipping > 0 && (
            <p className="text-xs text-muted-foreground">
              Add {formatCurrency(50 - cart.subtotal)} more for free shipping!
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2 mt-4">
          {user ? (
            <Button 
              onClick={() => onPageChange('checkout')} 
              className="w-full"
              size="lg"
              data-testid="proceed-to-checkout-button"
            >
              Proceed to Checkout
            </Button>
          ) : (
            <Button 
              onClick={() => onPageChange('login')} 
              className="w-full"
              size="lg"
            >
              Login to Checkout
            </Button>
          )}
          <div className="flex space-x-2">
            <Button 
              onClick={() => onPageChange('products')} 
              variant="outline" 
              className="flex-1"
              size="sm"
            >
              Continue Shopping
            </Button>
            <Button 
              onClick={clearCart} 
              variant="outline" 
              size="sm"
              className="text-destructive hover:text-destructive"
            >
              Clear Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}