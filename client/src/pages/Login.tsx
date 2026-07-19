import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Button } from '../components/ui/button.js';
import { Input } from '../components/ui/input.js';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card.js';
import { Compass, Mail, Lock, ShieldAlert } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, user, error: authError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If user is already logged in, redirect straight to admin dashboard
  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  // Read URL params (e.g. if token expired and login interceptor redirected)
  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      setError('Your session has expired. Please log in again.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError(null);

    const success = await login(email, password);
    setLoading(false);

    if (success) {
      navigate('/admin');
    } else {
      setError(authError || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-10 px-4">
      <Card className="w-full max-w-md border border-border shadow-lg relative overflow-hidden">
        {/* Decorative color band */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        <CardHeader className="text-center pt-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mb-3 shadow-inner">
            <Compass className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold font-display">Welcome Back</CardTitle>
          <CardDescription>
            Admin portal login for Travel Lead Assistant
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-2">
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs shadow-sm font-medium animate-in fade-in duration-200">
                <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block pl-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="admin@travelassistant.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block pl-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pb-8 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl cursor-pointer text-sm shadow-md shadow-blue-500/10 active:scale-98"
            >
              {loading ? 'Logging in...' : 'Access Dashboard'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="text-xs text-slate-400 hover:text-slate-600 rounded-xl"
              onClick={() => navigate('/')}
            >
              Back to Trip Planner
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
export default Login;
