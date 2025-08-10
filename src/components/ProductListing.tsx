import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/ProductCard';
import { sampleProducts, categories } from '@/lib/data';
import { MagnifyingGlass, FunnelSimple } from '@phosphor-icons/react';

interface ProductListingProps {
  searchQuery: string;
  onProductSelect: (productId: string) => void;
}

export function ProductListing({ searchQuery, onProductSelect }: ProductListingProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Use either the external search query or local one
  const activeSearchQuery = searchQuery || localSearchQuery;

  const filteredProducts = useMemo(() => {
    let filtered = sampleProducts;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (activeSearchQuery.trim()) {
      const query = activeSearchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'stock':
          return b.stock - a.stock;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [selectedCategory, activeSearchQuery, sortBy]);

  const handleLocalSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Products</h1>
        <p className="text-muted-foreground">
          Discover our collection of {sampleProducts.length} products
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <form onSubmit={handleLocalSearch} className="md:col-span-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="pl-10"
              />
              <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            </div>
          </form>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <FunnelSimple size={16} className="mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="price-low">Price (Low to High)</SelectItem>
              <SelectItem value="price-high">Price (High to Low)</SelectItem>
              <SelectItem value="stock">Stock Level</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {(activeSearchQuery || selectedCategory !== 'All') && (
          <div className="flex flex-wrap gap-2 mt-4">
            {activeSearchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: "{activeSearchQuery}"
                <button
                  onClick={() => setLocalSearchQuery('')}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedCategory !== 'All' && (
              <Badge variant="secondary" className="gap-1">
                Category: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {sampleProducts.length} products
          {activeSearchQuery && ` for "${activeSearchQuery}"`}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onProductSelect}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button
            onClick={() => {
              setLocalSearchQuery('');
              setSelectedCategory('All');
            }}
            variant="outline"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}