'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { logout } from '../app/store/slices/authSlice';
import { Button } from './ui/Button';
import { User, LogOut, Home, BarChart3, BookOpen, Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { RootState, AppDispatch } from '../app/store/store';

export default function Header() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { theme, setTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide header when scrolling down, show when scrolling up or at top
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
      
      // Clear existing timeout
      clearTimeout(scrollTimeout);
      
      // Set timeout to show header when scrolling stops
      scrollTimeout = setTimeout(() => {
        setIsVisible(true);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [lastScrollY]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-7 w-7" />
          <span className="text-2xl font-bold">CourseMaster</span>
        </Link>

        <nav className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-1.5 text-base font-medium hover:text-primary transition-colors">
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className="flex items-center space-x-1.5 text-base font-medium hover:text-primary transition-colors">
                <BarChart3 className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>

              <button className="relative p-2 hover:bg-accent rounded-md transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full px-1.5 min-w-5 h-5 flex items-center justify-center font-medium">3</span>
              </button>

              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="relative p-2 hover:bg-accent rounded-md transition-colors flex items-center justify-center"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </button>

              {user.role === 'admin' && (
                <>
                  <Link href="/admin" className="text-base font-medium hover:text-primary transition-colors">
                    Admin Dashboard
                  </Link>
                </>
              )}

              <Link href="/profile" className="flex items-center space-x-1.5 text-base font-medium hover:text-primary transition-colors">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>

              <Button variant="outline" size="sm" onClick={handleLogout} className="h-9">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="h-9 text-base">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="h-9 text-base">Register</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}