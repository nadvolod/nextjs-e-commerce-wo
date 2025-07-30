import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye } from '@phosphor-icons/react';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/data';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (productId: string) => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { addToCart } = useCart();

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <Card className="h-full flex flex-col group hover:shadow-lg transition-shadow duration-200">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm font-semibold">
              Out of Stock
            </Badge>
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <Badge variant="destructive" className="absolute top-2 right-2 text-xs">
            Only {product.stock} left
          </Badge>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
          <Badge variant="secondary" className="ml-2 text-xs">
            {product.category}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(product.price)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <CardDescription className="line-clamp-3">
          {product.description}
        </CardDescription>
        <div className="mt-3 text-sm text-muted-foreground">
          Stock: <span className={`font-medium ${isLowStock ? 'text-destructive' : ''}`}>
            {product.stock} available
          </span>
        </div>
      </CardContent>

      <CardFooter className="space-x-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(product.id)}
          className="flex-1"
        >
          <Eye size={16} className="mr-2" />
          Details
        </Button>
        <Button
          size="sm"
          onClick={() => addToCart(product.id)}
          disabled={isOutOfStock}
          className="flex-1"
        >
          <ShoppingCart size={16} className="mr-2" />
          {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}