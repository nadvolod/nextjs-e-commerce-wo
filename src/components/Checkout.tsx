import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Truck, CheckCircle } from '@phosphor-icons/react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { sampleProducts, formatCurrency, generateOrderId } from '@/lib/data';
import { Order } from '@/types';
import { useKV } from '@github/spark/hooks';
import { toast } from 'sonner';

interface CheckoutProps {
  onPageChange: (page: string) => void;
}

export function Checkout({ onPageChange }: CheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orders, setOrders] = useKV<Order[]>('user-orders', []);
  
  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>
            Please log in to continue with checkout.
          </AlertDescription>
        </Alert>
        <Button onClick={() => onPageChange('login')} className="mt-4">
          Go to Login
        </Button>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="text-4xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-4">Add some products to continue with checkout.</p>
        <Button onClick={() => onPageChange('products')}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newOrderId = generateOrderId();
    const newOrder: Order = {
      id: newOrderId,
      userId: user.id,
      items: cart.items,
      subtotal: cart.subtotal,
      tax: cart.tax,
      shipping: cart.shipping,
      total: cart.total,
      status: 'processing',
      createdAt: new Date().toISOString()
    };

    setOrders(currentOrders => [...currentOrders, newOrder]);
    clearCart();
    setOrderId(newOrderId);
    setOrderComplete(true);
    setIsProcessing(false);
    
    toast.success('Order placed successfully!');
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
            <p className="text-muted-foreground mb-4">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
            <div className="bg-muted p-4 rounded-lg mb-6">
              <p className="font-semibold">Order ID: {orderId}</p>
              <p className="text-sm text-muted-foreground">
                Total: {formatCurrency(cart.total)}
              </p>
            </div>
            <div className="space-x-4">
              <Button onClick={() => onPageChange('orders')}>
                View Orders
              </Button>
              <Button variant="outline" onClick={() => onPageChange('products')}>
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck size={20} className="mr-2" />
                  Shipping Information
                </CardTitle>
                <CardDescription>
                  Where should we deliver your order?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={shippingInfo.fullName}
                    onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard size={20} className="mr-2" />
                  Payment Information
                </CardTitle>
                <CardDescription>
                  Secure payment processing (demo mode)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nameOnCard">Name on Card</Label>
                  <Input
                    id="nameOnCard"
                    value={paymentInfo.nameOnCard}
                    onChange={(e) => setPaymentInfo({...paymentInfo, nameOnCard: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={paymentInfo.expiryDate}
                      onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={paymentInfo.cvv}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing Payment...' : `Place Order - ${formatCurrency(cart.total)}`}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              <div className="space-y-3">
                {cart.items.map((item) => {
                  const product = sampleProducts.find(p => p.id === item.productId);
                  if (!product) return null;

                  return (
                    <div key={item.productId} className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-sm">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <Separator />

              {/* Totals */}
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}