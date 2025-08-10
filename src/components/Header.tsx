import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ShoppingCart, MagnifyingGlass, User, Package, SignOut } from '@phosphor-icons/react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getCartItemCount } = useCart();
  const { user, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    onSearch(searchQuery);
    setIsMobileMenuOpen(false); // Close mobile menu when searching
    setTimeout(() => setIsSearching(false), 300);
  };

  const handlePageChange = (page: string) => {
    onPageChange(page);
    setIsMobileMenuOpen(false);
  };

  const cartItemCount = getCartItemCount();

  const navigation = [
    { name: 'Home', page: 'home' },
    { name: 'Products', page: 'products' },
    { name: 'API Test', page: 'api-testing' },
    ...(user?.role === 'admin' ? [{ name: 'Admin', page: 'admin' }] : []),
  ];

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu + Logo */}
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Button - First for better accessibility */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="md:hidden p-2 w-10 h-10 flex items-center justify-center shrink-0 border-border"
                  aria-label="Open mobile menu"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
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
                      <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
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
                        onClick={() => handlePageChange(item.page)}
                        className={`block w-full text-left py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                          currentPage === item.page
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </nav>

                  {/* User Actions in Mobile Menu */}
                  {user ? (
                    <div className="pt-4 border-t border-border space-y-2">
                      <button
                        onClick={() => handlePageChange('orders')}
                        className="flex items-center w-full text-left py-3 px-4 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                      >
                        <Package className="mr-2" size={16} />
                        My Orders
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center w-full text-left py-3 px-4 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground text-destructive"
                      >
                        <SignOut className="mr-2" size={16} />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="pt-4 border-t border-border">
                      <button
                        onClick={() => handlePageChange('login')}
                        className="flex items-center w-full text-left py-3 px-4 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                      >
                        <User className="mr-2" size={16} />
                        Login
                      </button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <button
              onClick={() => handlePageChange('home')}
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
                onClick={() => handlePageChange(item.page)}
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
              <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            </div>
            <Button type="submit" size="sm" disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
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
                <CartSummary onPageChange={handlePageChange} />
              </SheetContent>
            </Sheet>

            {/* User Menu - Hidden on mobile, shown in hamburger menu instead */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden md:flex">
                    <User size={20} />
                    <span className="hidden sm:inline ml-2">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handlePageChange('orders')}>
                    <Package className="mr-2" size={16} />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <SignOut className="mr-2" size={16} />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => handlePageChange('login')} 
                variant="outline" 
                size="sm"
                className="hidden md:flex"
              >
                <User size={20} />
                <span className="hidden sm:inline ml-2">Login</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}