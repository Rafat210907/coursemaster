'use client';

import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { logout } from '../app/store/slices/authSlice';
import { Button } from './ui/Button';
import { User, LogOut, Home, BarChart3, BookOpen, Settings, Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { RootState } from '../app/store/store';

export default function Header() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<any>();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6" />
          <span className="text-xl font-bold">CourseMaster</span>
        </Link>

        <nav className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-1 text-sm font-medium hover:text-primary">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className="flex items-center space-x-1 text-sm font-medium hover:text-primary">
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>

              <button className="relative p-2 hover:bg-accent rounded-md">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full px-1 min-w-5 h-5 flex items-center justify-center">3</span>
              </button>

              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 hover:bg-accent rounded-md"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </button>

              {user.role === 'admin' && (
                <>
                  <Link href="/admin/courses" className="text-sm font-medium hover:text-primary">
                    Admin Courses
                  </Link>
                  <Link href="/admin/analytics" className="text-sm font-medium hover:text-primary">
                    Analytics
                  </Link>
                  <Link href="/admin/quiz" className="text-sm font-medium hover:text-primary">
                    Create Quiz
                  </Link>
                </>
              )}

              <Link href="/profile" className="flex items-center space-x-1 text-sm font-medium hover:text-primary">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>

              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}