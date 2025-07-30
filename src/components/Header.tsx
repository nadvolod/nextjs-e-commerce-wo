import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ShoppingCart, Search, User, Menu, Package, LogOut } from '@phosphor-icons/react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { CartSummary } from './CartSummary';

interface HeaderProps {
  onSearch: (query: string) => void;
  onPageChange: (page: string) => void;
  currentPage: string;
}

export function Header({ onSearch, onPageChange, currentPage }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { getCartItemCount } = useCart();
  const { user, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    onSearch(searchQuery);
    setTimeout(() => setIsSearching(false), 300);
  };

  const cartItemCount = getCartItemCount();

  const navigation = [
    { name: 'Home', page: 'home' },
    { name: 'Products', page: 'products' },
    ...(user?.role === 'admin' ? [{ name: 'Admin', page: 'admin' }] : []),
  ];

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => onPageChange('home')}
              className="text-xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              ShopTech
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <button
                key={item.page}
                onClick={() => onPageChange(item.page)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  currentPage === item.page
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            </div>
            <Button type="submit" size="sm" disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                  <ShoppingCart size={20} />
                  {cartItemCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 px-2 py-1 text-xs min-w-[1.25rem] h-5"
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Shopping Cart</SheetTitle>
                </SheetHeader>
                <CartSummary onPageChange={onPageChange} />
              </SheetContent>
            </Sheet>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User size={20} />
                    <span className="hidden sm:inline ml-2">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onPageChange('orders')}>
                    <Package className="mr-2" size={16} />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2" size={16} />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => onPageChange('login')} variant="outline" size="sm">
                <User size={20} />
                <span className="hidden sm:inline ml-2">Login</span>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    </div>
                    <Button type="submit" size="sm" disabled={isSearching}>
                      Search
                    </Button>
                  </form>

                  {/* Mobile Navigation */}
                  <nav className="space-y-2">
                    {navigation.map((item) => (
                      <button
                        key={item.page}
                        onClick={() => onPageChange(item.page)}
                        className="block w-full text-left py-2 px-3 rounded-md text-sm font-medium hover:bg-accent"
                      >
                        {item.name}
                      </button>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}