import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Package, Calendar, MapPin, CreditCard } from '@phosphor-icons/react';
import { useAuth } from '@/contexts/AuthContext';
import { useKV } from '@/hooks/useKV';
import { sampleProducts, formatCurrency } from '@/lib/data';
import { Order } from '@/types';

interface OrderConfirmationProps {
  orderId: string | null;
  onPageChange: (page: string, orderId?: string) => void;
}

export function OrderConfirmation({ orderId, onPageChange }: OrderConfirmationProps) {
  const { user } = useAuth();
  const [orders] = useKV<Order[]>('user-orders', []);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Please log in to view this order</h2>
        <Button onClick={() => onPageChange('login')}>
          Go to Login
        </Button>
      </div>
    );
  }

  const foundOrder = orderId ? orders.find(o => o.id === orderId) : undefined;
  const order = foundOrder && (foundOrder.userId === user.id || user.role === 'admin')
    ? foundOrder
    : undefined;

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'processing':
        return 'default';
      case 'shipped':
        return 'outline';
      case 'delivered':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'processing':
        return 'text-blue-600';
      case 'shipped':
        return 'text-purple-600';
      case 'delivered':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center" data-testid="order-confirmation">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-bold mb-2">Order not found</h2>
        <p className="text-muted-foreground mb-4">
          We couldn't find the order you're looking for.
        </p>
        <div className="space-x-4">
          <Button onClick={() => onPageChange('orders')}>
            View All Orders
          </Button>
          <Button variant="outline" onClick={() => onPageChange('products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" data-testid="order-confirmation">
      <div className="text-center mb-8">
        <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
      </div>

      <div className="space-y-6">
        {/* Order Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Package size={20} />
                  <span data-testid="order-confirmation-id">Order #{order.id}</span>
                </CardTitle>
                <CardDescription className="flex items-center space-x-4 mt-1">
                  <span className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <CreditCard size={14} className="mr-1" />
                    {formatCurrency(order.total)}
                  </span>
                </CardDescription>
              </div>
              <Badge
                variant={getStatusVariant(order.status)}
                className={`${getStatusColor(order.status)} capitalize`}
              >
                {order.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Order Items */}
            <div className="space-y-3">
              {order.items.map((item) => {
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
                        {formatCurrency(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-sm">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin size={20} className="mr-2" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            {order.shippingAddress ? (
              <div className="text-sm space-y-1">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p className="text-muted-foreground">{order.shippingAddress.country}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No shipping address on record for this order.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>
                  {order.shipping === 0 ? (
                    <Badge variant="secondary" className="text-xs">FREE</Badge>
                  ) : (
                    formatCurrency(order.shipping)
                  )}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-base">
                <span>Total:</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-8 space-x-4">
        <Button onClick={() => onPageChange('orders')}>
          View All Orders
        </Button>
        <Button variant="outline" onClick={() => onPageChange('products')}>
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
