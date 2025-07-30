import { Product, User, Order } from '@/types';

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 99.99,
    description: 'Premium quality wireless headphones with noise cancellation and 30-hour battery life.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: 'Electronics',
    stock: 15
  },
  {
    id: '2',
    name: 'Organic Cotton T-Shirt',
    price: 29.99,
    description: 'Soft, breathable organic cotton t-shirt available in multiple colors.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    category: 'Clothing',
    stock: 25
  },
  {
    id: '3',
    name: 'Stainless Steel Water Bottle',
    price: 24.99,
    description: 'Insulated stainless steel water bottle that keeps drinks cold for 24 hours.',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
    category: 'Home & Garden',
    stock: 30
  },
  {
    id: '4',
    name: 'Mechanical Gaming Keyboard',
    price: 129.99,
    description: 'RGB backlit mechanical keyboard with blue switches and programmable keys.',
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop',
    category: 'Electronics',
    stock: 8
  },
  {
    id: '5',
    name: 'Yoga Mat Premium',
    price: 49.99,
    description: 'Non-slip yoga mat with extra cushioning and alignment lines.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
    category: 'Sports & Fitness',
    stock: 20
  },
  {
    id: '6',
    name: 'Coffee Beans - Dark Roast',
    price: 16.99,
    description: 'Premium dark roast coffee beans sourced from sustainable farms.',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
    category: 'Food & Beverage',
    stock: 45
  },
  {
    id: '7',
    name: 'Leather Crossbody Bag',
    price: 89.99,
    description: 'Genuine leather crossbody bag with adjustable strap and multiple compartments.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    category: 'Accessories',
    stock: 12
  },
  {
    id: '8',
    name: 'Smart Fitness Watch',
    price: 199.99,
    description: 'Advanced fitness tracking with heart rate monitor and GPS.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    category: 'Electronics',
    stock: 18
  },
  {
    id: '9',
    name: 'Ceramic Plant Pot Set',
    price: 34.99,
    description: 'Set of 3 ceramic plant pots with drainage holes and saucers.',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop',
    category: 'Home & Garden',
    stock: 22
  },
  {
    id: '10',
    name: 'Wireless Phone Charger',
    price: 39.99,
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
    category: 'Electronics',
    stock: 35
  },
  {
    id: '11',
    name: 'Denim Jacket Classic',
    price: 79.99,
    description: 'Timeless denim jacket with a comfortable fit and vintage wash.',
    image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=400&fit=crop',
    category: 'Clothing',
    stock: 16
  },
  {
    id: '12',
    name: 'Essential Oil Diffuser',
    price: 54.99,
    description: 'Ultrasonic aromatherapy diffuser with color-changing LED lights.',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
    category: 'Home & Garden',
    stock: 28
  },
  {
    id: '13',
    name: 'Protein Powder Vanilla',
    price: 44.99,
    description: 'Whey protein powder with 25g protein per serving and natural vanilla flavor.',
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop',
    category: 'Sports & Fitness',
    stock: 33
  },
  {
    id: '14',
    name: 'Artisan Tea Collection',
    price: 32.99,
    description: 'Premium tea sampler with 12 different artisan blends.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    category: 'Food & Beverage',
    stock: 19
  },
  {
    id: '15',
    name: 'Minimalist Watch',
    price: 149.99,
    description: 'Elegant minimalist watch with leather strap and Swiss movement.',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&h=400&fit=crop',
    category: 'Accessories',
    stock: 11
  }
];

export const testUsers: User[] = [
  {
    id: '1',
    email: 'admin@test.com',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: '2',
    email: 'user@test.com',
    name: 'Test Customer',
    role: 'customer'
  }
];

export const categories = [
  'All',
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports & Fitness',
  'Food & Beverage',
  'Accessories'
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export function calculateCartTotals(items: { productId: string; quantity: number; price: number }[]) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const total = subtotal + tax + shipping;
  
  return { subtotal, tax, shipping, total };
}

export function generateOrderId(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
}