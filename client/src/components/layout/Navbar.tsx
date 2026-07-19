import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Sun, Moon, LogIn, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { Button } from '../ui/button.js';
import { STORAGE_KEYS } from '../../utils/constants.js';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdminDashboard = location.pathname.startsWith('/admin') || location.pathname.startsWith('/lead/');

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-card/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo brand */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform duration-200">
              <Compass className="h-5.5 w-5.5 animate-spin-slow" />
            </div>
            <div>
              <span className="font-extrabold text-slate-800 dark:text-slate-100 text-md tracking-tight font-display">
                Vagabond
              </span>
              <span className="text-[10px] block text-muted-foreground font-semibold uppercase tracking-wider -mt-1.5">
                Lead Assistant
              </span>
            </div>
          </Link>

          {/* Right hand navigation */}
          <div className="flex items-center space-x-2">
            {/* Theme switcher */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-xl h-10 w-10 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-4.5 w-4.5 text-slate-600" />
              ) : (
                <Sun className="h-4.5 w-4.5 text-slate-300" />
              )}
            </Button>

            {user ? (
              <div className="flex items-center space-x-2">
                {isAdminDashboard ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl h-9.5 cursor-pointer font-medium"
                    onClick={() => navigate('/')}
                  >
                    Trip Planner
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl h-9.5 cursor-pointer font-medium"
                    onClick={() => navigate('/admin')}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-1.5" />
                    Dashboard
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="rounded-xl h-9.5 text-slate-500 hover:text-destructive flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl h-9.5 text-slate-600 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
                onClick={() => navigate('/login')}
              >
                <LogIn className="h-4 w-4" />
                <span>Admin Login</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
