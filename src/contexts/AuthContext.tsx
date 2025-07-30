import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types';
import { testUsers } from '@/lib/data';
import { useKV } from '@github/spark/hooks';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useKV<string | null>('auth-user-id', null);

  useEffect(() => {
    if (currentUserId) {
      const foundUser = testUsers.find(u => u.id === currentUserId);
      if (foundUser) {
        setUser(foundUser);
      }
    }
    setIsLoading(false);
  }, [currentUserId]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test credentials
    const credentials = {
      'admin@test.com': 'admin123',
      'user@test.com': 'user123'
    };
    
    if (credentials[email as keyof typeof credentials] === password) {
      const foundUser = testUsers.find(u => u.email === email);
      if (foundUser) {
        setUser(foundUser);
        setCurrentUserId(foundUser.id);
        setIsLoading(false);
        return true;
      }
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    setCurrentUserId(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}