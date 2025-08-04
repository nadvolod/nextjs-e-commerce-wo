import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { ApiResponse } from '@/lib/api-backend';

interface ApiTestingProps {
  onPageChange: (page: string) => void;
}

export function ApiTesting({ onPageChange }: ApiTestingProps) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [testData, setTestData] = useState({
    email: 'user@test.com',
    password: 'user123',
    productId: '1',
    quantity: 1,
    search: 'headphones',
    category: 'Electronics'
  });

  const formatResponse = (result: ApiResponse<any>) => {
    return JSON.stringify(result, null, 2);
  };

  const runTest = async (testName: string, testFn: () => Promise<ApiResponse<any>>) => {
    setLoading(true);
    try {
      const result = await testFn();
      setResponse(`=== ${testName} ===\n${formatResponse(result)}`);
      
      if (result.success) {
        toast.success(`${testName} successful`);
      } else {
        toast.error(`${testName} failed: ${result.error}`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setResponse(`=== ${testName} ERROR ===\n${errorMsg}`);
      toast.error(`${testName} error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // Authentication Tests
  const testLogin = () => runTest('Login Test', () => 
    api.login(testData.email, testData.password)
  );

  const testGetCurrentUser = () => runTest('Get Current User', () => 
    api.getCurrentUser()
  );

  const testLogout = () => runTest('Logout Test', () => 
    api.logout()
  );

  // Product Tests
  const testGetProducts = () => runTest('Get Products', () => 
    api.products.getAll({ 
      search: testData.search, 
      category: testData.category === 'All' ? undefined : testData.category 
    })
  );

  const testGetProduct = () => runTest('Get Single Product', () => 
    api.products.getById(testData.productId)
  );

  // Cart Tests
  const testAddToCart = () => runTest('Add to Cart', () => 
    api.cart.add(testData.productId, testData.quantity)
  );

  const testGetCart = () => runTest('Get Cart', () => 
    api.cart.get()
  );

  const testUpdateCart = () => runTest('Update Cart Item', () => 
    api.cart.update(testData.productId, testData.quantity + 1)
  );

  const testRemoveFromCart = () => runTest('Remove from Cart', () => 
    api.cart.remove(testData.productId)
  );

  const testClearCart = () => runTest('Clear Cart', () => 
    api.cart.clear()
  );

  // Order Tests
  const testCreateOrder = () => runTest('Create Order', () => 
    api.orders.create()
  );

  const testGetOrders = () => runTest('Get Orders', () => 
    api.orders.getAll()
  );

  // Admin Tests
  const testAdminStats = () => runTest('Admin Stats', () => 
    api.admin.stats()
  );

  const testAdminOrders = () => runTest('Admin Orders', () => 
    api.admin.orders()
  );

  // Utility Tests
  const testResetData = () => runTest('Reset Data', () => 
    api.resetData()
  );

  const isAuthenticated = api.isAuthenticated();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">API Testing Console</h1>
        <p className="text-muted-foreground mb-4">
          Test the in-memory API backend functionality. Use the controls below to test different endpoints.
        </p>
        <div className="flex items-center gap-4 mb-6">
          <Badge variant={isAuthenticated ? "default" : "secondary"}>
            {isAuthenticated ? "Authenticated" : "Not Authenticated"}
          </Badge>
          <Button variant="outline" onClick={() => onPageChange('home')}>
            Back to App
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Test Controls */}
        <div className="space-y-6">
          {/* Test Data Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Test Data Configuration</CardTitle>
              <CardDescription>
                Configure the data used for API tests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={testData.email}
                    onChange={(e) => setTestData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={testData.password}
                    onChange={(e) => setTestData(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="productId">Product ID</Label>
                  <Input
                    id="productId"
                    value={testData.productId}
                    onChange={(e) => setTestData(prev => ({ ...prev, productId: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={testData.quantity}
                    onChange={(e) => setTestData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="search">Search Term</Label>
                  <Input
                    id="search"
                    value={testData.search}
                    onChange={(e) => setTestData(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={testData.category}
                    onChange={(e) => setTestData(prev => ({ ...prev, category: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Authentication Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Authentication Tests</CardTitle>
              <CardDescription>
                Test user login, logout, and session management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={testLogin} disabled={loading} variant="outline">
                  Login
                </Button>
                <Button onClick={testGetCurrentUser} disabled={loading} variant="outline">
                  Get User
                </Button>
              </div>
              <Button onClick={testLogout} disabled={loading} variant="outline" className="w-full">
                Logout
              </Button>
            </CardContent>
          </Card>

          {/* Product Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Product Tests</CardTitle>
              <CardDescription>
                Test product retrieval and search functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={testGetProducts} disabled={loading} variant="outline">
                  Get Products
                </Button>
                <Button onClick={testGetProduct} disabled={loading} variant="outline">
                  Get Product
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cart Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Cart Tests</CardTitle>
              <CardDescription>
                Test shopping cart operations (requires authentication)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={testAddToCart} disabled={loading} variant="outline">
                  Add to Cart
                </Button>
                <Button onClick={testGetCart} disabled={loading} variant="outline">
                  Get Cart
                </Button>
                <Button onClick={testUpdateCart} disabled={loading} variant="outline">
                  Update Cart
                </Button>
                <Button onClick={testRemoveFromCart} disabled={loading} variant="outline">
                  Remove Item
                </Button>
              </div>
              <Button onClick={testClearCart} disabled={loading} variant="outline" className="w-full">
                Clear Cart
              </Button>
            </CardContent>
          </Card>

          {/* Order Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Order Tests</CardTitle>
              <CardDescription>
                Test order creation and retrieval (requires authentication)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={testCreateOrder} disabled={loading} variant="outline">
                  Create Order
                </Button>
                <Button onClick={testGetOrders} disabled={loading} variant="outline">
                  Get Orders
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Admin Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Tests</CardTitle>
              <CardDescription>
                Test admin functionality (requires admin authentication)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={testAdminStats} disabled={loading} variant="outline">
                  Admin Stats
                </Button>
                <Button onClick={testAdminOrders} disabled={loading} variant="outline">
                  Admin Orders
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Utility Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Utility Tests</CardTitle>
              <CardDescription>
                Reset data and other utility functions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testResetData} 
                disabled={loading} 
                variant="destructive" 
                className="w-full"
              >
                Reset All Data
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Response Display */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>API Response</CardTitle>
              <CardDescription>
                Latest API response will be displayed here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Textarea
                  value={response || 'No API calls made yet. Click a test button to see the response.'}
                  readOnly
                  className="h-96 font-mono text-sm"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-8" />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Test Scenarios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Shopping Flow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>1. Get Products (no auth required)</p>
              <p>2. Login as customer</p>
              <p>3. Add products to cart</p>
              <p>4. Get cart to verify</p>
              <p>5. Create order</p>
              <p>6. Get orders to verify</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Admin Flow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>1. Login as admin (admin@test.com)</p>
              <p>2. Get admin stats</p>
              <p>3. Get all orders</p>
              <p>4. Test product creation (API only)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Error Testing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>1. Try cart operations without auth</p>
              <p>2. Try admin operations as customer</p>
              <p>3. Add invalid product to cart</p>
              <p>4. Create order with empty cart</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>1. Reset data to clean state</p>
              <p>2. Verify data persistence</p>
              <p>3. Test session management</p>
              <p>4. Verify cross-user isolation</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}