import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Minus, Plus, Package, Star } from '@phosphor-icons/react';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/data';
import { useCart } from '@/contexts/CartContext';

interface ProductDetailsProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetails({ product, isOpen, onClose }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    setQuantity(1);
    onClose();
  };

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const maxQuantity = Math.min(product.stock, 10);

  const features = [
    'Premium Quality Materials',
    'Fast & Free Shipping',
    '30-Day Return Policy',
    '24/7 Customer Support'
  ];

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
          <DialogDescription>
            <Badge variant="secondary" className="mt-2">
              {product.category}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg font-semibold px-4 py-2">
                    Out of Stock
                  </Badge>
                </div>
              )}
              {isLowStock && !isOutOfStock && (
                <Badge variant="destructive" className="absolute top-4 right-4">
                  Only {product.stock} left!
                </Badge>
              )}
            </div>

            {/* Product Features */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">What's Included:</h4>
              <ul className="space-y-1">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-muted-foreground">
                    <Star size={14} className="mr-2 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Price */}
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {formatCurrency(product.price)}
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Package size={16} />
                <span>
                  Stock: <span className={`font-medium ${isLowStock ? 'text-destructive' : ''}`}>
                    {product.stock} available
                  </span>
                </span>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Separator />

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Quantity</label>
                <div className="flex items-center space-x-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1 || isOutOfStock}
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="text-lg font-medium w-12 text-center">
                    {quantity}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= maxQuantity || isOutOfStock}
                  >
                    <Plus size={16} />
                  </Button>
                  <span className="text-sm text-muted-foreground ml-4">
                    Max: {maxQuantity}
                  </span>
                </div>
              </div>

              {/* Total Price */}
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Price:</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(product.price * quantity)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="w-full"
                  size="lg"
                >
                  <ShoppingCart size={20} className="mr-2" />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Continue Shopping
                </Button>
              </div>

              {/* Shipping Info */}
              <div className="text-sm text-muted-foreground space-y-1">
                <p>✓ Free shipping on orders over $50</p>
                <p>✓ Estimated delivery: 2-3 business days</p>
                <p>✓ 30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}