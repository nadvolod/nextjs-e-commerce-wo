import { api } from './api-client';

/**
 * Integration tests for the API backend
 * Run these tests to verify the API functionality
 */

export async function runApiTests() {
  console.log('🧪 Starting API Backend Tests...\n');

  let testsPassed = 0;
  let testsTotal = 0;

  const runTest = async (name: string, testFn: () => Promise<boolean>) => {
    testsTotal++;
    try {
      const result = await testFn();
      if (result) {
        console.log(`✅ ${name}`);
        testsPassed++;
      } else {
        console.log(`❌ ${name}`);
      }
    } catch (error) {
      console.log(`❌ ${name} - Error: ${error}`);
    }
  };

  // Test 1: Get products without authentication
  await runTest('Get Products (No Auth)', async () => {
    const result = await api.products.getAll();
    return result.success && Array.isArray(result.data) && result.data.length > 0;
  });

  // Test 2: Authentication test
  await runTest('Login with Valid Credentials', async () => {
    const result = await api.login('user@test.com', 'user123');
    return result.success && result.data && result.data.user.email === 'user@test.com';
  });

  // Test 3: Get current user after login
  await runTest('Get Current User After Login', async () => {
    const result = await api.getCurrentUser();
    return result.success && result.data && result.data.email === 'user@test.com';
  });

  // Test 4: Add item to cart
  await runTest('Add Item to Cart', async () => {
    const result = await api.cart.add('1', 2);
    return result.success;
  });

  // Test 5: Get cart with items
  await runTest('Get Cart with Items', async () => {
    const result = await api.cart.get();
    return result.success && result.data && result.data.items.length > 0;
  });

  // Test 6: Update cart item
  await runTest('Update Cart Item Quantity', async () => {
    const result = await api.cart.update('1', 3);
    return result.success;
  });

  // Test 7: Create order from cart
  await runTest('Create Order from Cart', async () => {
    const result = await api.orders.create();
    return result.success && result.data && result.data.id;
  });

  // Test 8: Get user orders
  await runTest('Get User Orders', async () => {
    const result = await api.orders.getAll();
    return result.success && Array.isArray(result.data) && result.data.length > 0;
  });

  // Test 9: Admin login
  await runTest('Admin Login', async () => {
    const result = await api.login('admin@test.com', 'admin123');
    return result.success && result.data && result.data.user.role === 'admin';
  });

  // Test 10: Admin stats
  await runTest('Get Admin Stats', async () => {
    const result = await api.admin.stats();
    return result.success && result.data && typeof result.data.totalRevenue === 'number';
  });

  // Test 11: Get single product
  await runTest('Get Single Product', async () => {
    const result = await api.products.getById('1');
    return result.success && result.data && result.data.id === '1';
  });

  // Test 12: Search products
  await runTest('Search Products', async () => {
    const result = await api.products.getAll({ search: 'headphones' });
    return result.success && Array.isArray(result.data);
  });

  // Test 13: Filter by category
  await runTest('Filter Products by Category', async () => {
    const result = await api.products.getAll({ category: 'Electronics' });
    return result.success && Array.isArray(result.data);
  });

  // Test 14: Logout
  await runTest('User Logout', async () => {
    const result = await api.logout();
    return result.success;
  });

  // Test 15: Unauthorized access after logout
  await runTest('Unauthorized Access After Logout', async () => {
    const result = await api.getCurrentUser();
    return !result.success && result.error?.includes('Authentication required');
  });

  console.log(`\n📊 Test Results: ${testsPassed}/${testsTotal} tests passed`);
  
  if (testsPassed === testsTotal) {
    console.log('🎉 All tests passed! API backend is working correctly.');
    return true;
  } else {
    console.log('⚠️  Some tests failed. Check the API implementation.');
    return false;
  }
}

// Utility function to test error scenarios
export async function runErrorTests() {
  console.log('🔍 Running Error Scenario Tests...\n');

  let testsPassed = 0;
  let testsTotal = 0;

  const runTest = async (name: string, testFn: () => Promise<boolean>) => {
    testsTotal++;
    try {
      const result = await testFn();
      if (result) {
        console.log(`✅ ${name}`);
        testsPassed++;
      } else {
        console.log(`❌ ${name}`);
      }
    } catch (error) {
      console.log(`❌ ${name} - Error: ${error}`);
    }
  };

  // Error Test 1: Invalid login credentials
  await runTest('Invalid Login Credentials', async () => {
    const result = await api.login('invalid@test.com', 'wrong');
    return !result.success && result.error === 'Invalid credentials';
  });

  // Error Test 2: Access cart without authentication
  await runTest('Cart Access Without Auth', async () => {
    const result = await api.cart.get();
    return !result.success && result.error?.includes('Authentication required');
  });

  // Error Test 3: Non-existent product
  await runTest('Get Non-existent Product', async () => {
    const result = await api.products.getById('nonexistent');
    return !result.success && result.error === 'Product not found';
  });

  // Login for remaining tests
  await api.login('user@test.com', 'user123');

  // Error Test 4: Add non-existent product to cart
  await runTest('Add Non-existent Product to Cart', async () => {
    const result = await api.cart.add('nonexistent', 1);
    return !result.success && result.error === 'Product not found';
  });

  // Error Test 5: Add more items than in stock
  await runTest('Exceed Stock Limit', async () => {
    const result = await api.cart.add('1', 999);
    return !result.success && result.error === 'Insufficient stock';
  });

  // Error Test 6: Create order with empty cart
  await api.cart.clear();
  await runTest('Create Order with Empty Cart', async () => {
    const result = await api.orders.create();
    return !result.success && result.error === 'Cart is empty';
  });

  // Error Test 7: Customer accessing admin endpoints
  await runTest('Customer Accessing Admin Stats', async () => {
    const result = await api.admin.stats();
    return !result.success && result.error === 'Admin access required';
  });

  console.log(`\n📊 Error Test Results: ${testsPassed}/${testsTotal} tests passed`);
  return testsPassed === testsTotal;
}

// Performance test
export async function runPerformanceTests() {
  console.log('⚡ Running Performance Tests...\n');

  const startTime = Date.now();
  
  // Login
  await api.login('user@test.com', 'user123');
  
  // Run multiple operations
  const operations = [
    () => api.products.getAll(),
    () => api.products.getById('1'),
    () => api.cart.add('1', 1),
    () => api.cart.get(),
    () => api.cart.update('1', 2),
    () => api.getCurrentUser(),
  ];

  const promises = operations.map(op => op());
  await Promise.all(promises);

  const endTime = Date.now();
  const totalTime = endTime - startTime;

  console.log(`📈 Performance Results:`);
  console.log(`   Total time for ${operations.length} operations: ${totalTime}ms`);
  console.log(`   Average time per operation: ${Math.round(totalTime / operations.length)}ms`);
  
  if (totalTime < 2000) {
    console.log('✅ Performance is acceptable');
    return true;
  } else {
    console.log('⚠️  Performance might be slow');
    return false;
  }
}

// Combined test runner
export async function runAllTests() {
  console.log('🚀 Running Complete API Test Suite...\n');
  
  // Reset data first
  await api.resetData();
  
  const basicTests = await runApiTests();
  console.log('\n');
  
  const errorTests = await runErrorTests();
  console.log('\n');
  
  const perfTests = await runPerformanceTests();
  console.log('\n');

  if (basicTests && errorTests && perfTests) {
    console.log('🎊 All test suites passed! API backend is fully functional.');
  } else {
    console.log('❌ Some test suites failed. Check the implementation.');
  }

  return { basicTests, errorTests, perfTests };
}