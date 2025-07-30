import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { Header } from '@/components/Header';
import { Home } from '@/components/Home';
import { ProductListing } from '@/components/ProductListing';
import { ProductDetails } from '@/components/ProductDetails';
import { Login } from '@/components/Login';
import { Checkout } from '@/components/Checkout';
import { Orders } from '@/components/Orders';
import { AdminDashboard } from '@/components/AdminDashboard';
import { sampleProducts } from '@/lib/data';
import { Product } from '@/types';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (currentPage !== 'products') {
      setCurrentPage('products');
    }
  };

  const handleProductSelect = (productId: string) => {
    const product = sampleProducts.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setIsProductDetailsOpen(true);
    }
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    // Clear search when navigating away from products
    if (page !== 'products') {
      setSearchQuery('');
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home 
            onPageChange={handlePageChange}
            onProductSelect={handleProductSelect}
          />
        );
      case 'products':
        return (
          <ProductListing
            searchQuery={searchQuery}
            onProductSelect={handleProductSelect}
          />
        );
      case 'login':
        return <Login onPageChange={handlePageChange} />;
      case 'checkout':
        return <Checkout onPageChange={handlePageChange} />;
      case 'orders':
        return <Orders onPageChange={handlePageChange} />;
      case 'admin':
        return <AdminDashboard onPageChange={handlePageChange} />;
      default:
        return (
          <Home 
            onPageChange={handlePageChange}
            onProductSelect={handleProductSelect}
          />
        );
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Header
            onSearch={handleSearch}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
          
          <main>
            {renderCurrentPage()}
          </main>

          <ProductDetails
            product={selectedProduct}
            isOpen={isProductDetailsOpen}
            onClose={() => {
              setIsProductDetailsOpen(false);
              setSelectedProduct(null);
            }}
          />

          <Toaster position="bottom-right" />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;