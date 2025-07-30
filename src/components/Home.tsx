import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ShoppingCart, Star, Truck, Shield, Clock } from '@phosphor-icons/react';
import { ProductCard } from '@/components/ProductCard';
import { sampleProducts, categories, formatCurrency } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';

interface HomeProps {
  onPageChange: (page: string) => void;
  onProductSelect: (productId: string) => void;
}

export function Home({ onPageChange, onProductSelect }: HomeProps) {
  const { user } = useAuth();

  // Get featured products (first 4 products)
  const featuredProducts = sampleProducts.slice(0, 4);
  
  // Get categories excluding 'All'
  const productCategories = categories.filter(cat => cat !== 'All');

  const features = [
    {
      icon: <Truck size={24} />,
      title: 'Free Shipping',
      description: 'Free delivery on orders over $50'
    },
    {
      icon: <Shield size={24} />,
      title: 'Secure Payment',
      description: '100% secure payment processing'
    },
    {
      icon: <Clock size={24} />,
      title: 'Fast Delivery',
      description: '2-3 business days delivery'
    },
    {
      icon: <Star size={24} />,
      title: 'Quality Products',
      description: 'Premium quality guaranteed'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Welcome to{' '}
            <span className="text-primary">ShopTech</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover amazing products at unbeatable prices. Your one-stop shop for electronics, 
            clothing, home goods, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => onPageChange('products')}
              className="text-lg px-8"
            >
              <ShoppingCart size={20} className="mr-2" />
              Start Shopping
            </Button>
            {!user && (
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => onPageChange('login')}
                className="text-lg px-8"
              >
                Sign In for Better Experience
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-primary mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground">
              Browse our carefully curated product categories
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {productCategories.map((category) => {
              const categoryProducts = sampleProducts.filter(p => p.category === category);
              const categoryImage = categoryProducts[0]?.image;
              
              return (
                <Card 
                  key={category} 
                  className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => onPageChange('products')}
                >
                  <CardContent className="p-4 text-center">
                    {categoryImage && (
                      <img
                        src={categoryImage}
                        alt={category}
                        className="w-16 h-16 object-cover rounded-full mx-auto mb-3"
                      />
                    )}
                    <h3 className="font-medium text-sm mb-1">{category}</h3>
                    <p className="text-xs text-muted-foreground">
                      {categoryProducts.length} products
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">
                Hand-picked products just for you
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => onPageChange('products')}
              className="hidden sm:flex"
            >
              View All Products
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onProductSelect}
              />
            ))}
          </div>

          <div className="text-center sm:hidden">
            <Button 
              variant="outline" 
              onClick={() => onPageChange('products')}
              className="w-full"
            >
              View All Products
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">{sampleProducts.length}+</div>
              <div className="text-lg opacity-90">Products Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{productCategories.length}</div>
              <div className="text-lg opacity-90">Product Categories</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-lg opacity-90">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of satisfied customers and discover amazing deals today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => onPageChange('products')}
              className="text-lg px-8"
            >
              Browse Products
            </Button>
            {!user && (
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => onPageChange('login')}
                className="text-lg px-8"
              >
                Create Account
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}