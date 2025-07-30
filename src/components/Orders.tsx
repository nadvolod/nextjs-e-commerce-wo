import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Package, Calendar, CreditCard } from '@phosphor-icons/react';
import { useAuth } from '@/contexts/AuthContext';
import { sampleProducts, formatCurrency } from '@/lib/data';
import { Order } from '@/types';
import { useKV } from '@github/spark/hooks';

interface OrdersProps {
  onPageChange: (page: string) => void;
}

export function Orders({ onPageChange }: OrdersProps) {
  const { user } = useAuth();
  const [orders] = useKV<Order[]>('user-orders', []);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your orders</h2>
        <Button onClick={() => onPageChange('login')}>
          Go to Login
        </Button>
      </div>
    );
  }

  // Filter orders for current user (or show all for admin)
  const userOrders = user.role === 'admin' 
    ? orders 
    : orders.filter(order => order.userId === user.id);

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

  if (userOrders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          {user.role === 'admin' ? 'All Orders' : 'My Orders'}
        </h1>
        
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold mb-2">No orders found</h3>
          <p className="text-muted-foreground mb-4">
            {user.role === 'admin' 
              ? 'No orders have been placed yet.' 
              : "You haven't placed any orders yet."
            }
          </p>
          <Button onClick={() => onPageChange('products')}>
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          {user.role === 'admin' ? 'All Orders' : 'My Orders'}
        </h1>
        <div className="text-sm text-muted-foreground">
          {userOrders.length} order{userOrders.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="space-y-6">
        {userOrders
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Package size={20} />
                      <span>Order #{order.id}</span>
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
                <div className="space-y-3 mb-4">
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

                <Separator />

                {/* Order Summary */}
                <div className="mt-4 space-y-2 text-sm">
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

                {/* Admin Info */}
                {user.role === 'admin' && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      Customer ID: {order.userId}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Continue Shopping */}
      <div className="text-center mt-8">
        <Button onClick={() => onPageChange('products')} variant="outline">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}