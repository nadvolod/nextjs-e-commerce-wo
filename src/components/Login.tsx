import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeSlash, User, Lock } from '@phosphor-icons/react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface LoginProps {
  onPageChange: (page: string) => void;
}

export function Login({ onPageChange }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await login(email, password);
    if (success) {
      toast.success('Login successful!');
      onPageChange('home');
    } else {
      setError('Invalid email or password');
    }
  };

  const testCredentials = [
    { email: 'admin@test.com', password: 'admin123', role: 'Admin' },
    { email: 'user@test.com', password: 'user123', role: 'Customer' }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your account to continue shopping
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Test Credentials */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Test Credentials</CardTitle>
            <CardDescription className="text-xs">
              Use these credentials for testing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {testCredentials.map((cred, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{cred.role} Account</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEmail(cred.email);
                      setPassword(cred.password);
                    }}
                    disabled={isLoading}
                  >
                    Use This Account
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Email: {cred.email}</div>
                  <div>Password: {cred.password}</div>
                </div>
                {index < testCredentials.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            variant="link" 
            onClick={() => onPageChange('products')}
            className="text-sm"
          >
            Continue as Guest
          </Button>
        </div>
      </div>
    </div>
  );
}