'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { logout } from '../app/store/slices/authSlice';
import { Button } from './ui/Button';
import { User, LogOut, Home, BarChart3, BookOpen, Bell, Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { RootState, AppDispatch } from '../app/store/store';
import { fetchNotifications, markRead, markAllNotificationsRead } from '../app/store/slices/notificationSlice';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { unreadCount, notifications } = useSelector((state: RootState) => state.notifications);
  const dispatch = useDispatch<AppDispatch>();
  const { theme, setTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, user]);

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
    <header className={`fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
      <div className="max-w-7xl mx-auto flex h-14 items-center px-4 sm:px-6 gap-2">
        <Link href="/" className="flex items-center space-x-3 shrink-0 group" prefetch={false}>
          <div className="bg-primary/20 p-1.5 rounded-lg group-hover:bg-primary/30 transition-colors">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary neon-glow" />
          </div>
          <span className="text-xl sm:text-2xl font-black whitespace-nowrap gradient-text">CourseMaster</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 ml-auto">
          <Link href="/" className="flex items-center space-x-1.5 text-base font-medium hover:text-primary transition-colors" prefetch={false}>
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className="flex items-center space-x-1.5 text-base font-medium hover:text-primary transition-colors" prefetch={false}>
                <BarChart3 className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>

              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-accent rounded-md transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full px-1.5 min-w-5 h-5 flex items-center justify-center font-medium">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <div
                        className="fixed inset-0 z-40 bg-transparent"
                        onClick={() => setShowNotifications(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-50 glass-card overflow-hidden"
                      >
                        <div className="flex items-center justify-between p-4 border-b border-white/5">
                          <h3 className="font-semibold">Notifications</h3>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => dispatch(markAllNotificationsRead())}
                              className="text-xs text-primary hover:underline"
                            >
                              Mark all as read
                            </button>
                            <Link
                              href="/dashboard/notices"
                              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => setShowNotifications(false)}
                              prefetch={false}
                            >
                              View All
                            </Link>
                          </div>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                              <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                              <p className="text-sm">No new notifications</p>
                            </div>
                          ) : (
                            <div className="divide-y divide-white/5">
                              {notifications.slice(0, 10).map((notif) => (
                                <div
                                  key={notif._id}
                                  onClick={async () => {
                                    dispatch(markRead(notif._id));
                                    setShowNotifications(false);

                                    if (notif.type === 'course') {
                                      router.push(`/course/${notif.referenceId}`);
                                    } else if (notif.type === 'quiz') {
                                      // We need courseId for quizzes, but for now we redirect to notices or handle it
                                      // Ideally we'd fetch the quiz to get courseId, or encode it.
                                      // Let's assume the user will handle the exact landing.
                                      // Fixed route logic should be here.
                                      router.push(`/dashboard/notices`);
                                    } else {
                                      router.push('/dashboard/notices');
                                    }
                                  }}
                                  className={`p-4 hover:bg-white/5 transition-all cursor-pointer relative ${!notif.isRead ? 'bg-primary/5' : ''}`}
                                >
                                  <div className="flex gap-3">
                                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!notif.isRead ? 'bg-primary shadow-[0_0_10px_rgba(139,92,246,0.6)]' : 'bg-transparent'}`} />
                                    <div className="flex-1 space-y-1">
                                      <p className={`text-sm leading-snug ${!notif.isRead ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                                        {notif.message}
                                      </p>
                                      <p className="text-xs text-muted-foreground/40">
                                        {format(new Date(notif.createdAt), 'MMM d, h:mm a')}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="relative p-2 hover:bg-accent rounded-md transition-colors flex items-center justify-center"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </button>

              {user.role === 'admin' && (
                <Link href="/admin" className="text-base font-medium hover:text-primary transition-colors" prefetch={false}>
                  Admin
                </Link>
              )}

              <Link href="/profile" className="flex items-center space-x-1.5 text-base font-medium hover:text-primary transition-colors" prefetch={false}>
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>

              <Button variant="outline" size="sm" onClick={handleLogout} className="h-8 py-0">
                <LogOut className="h-3.5 w-3.5 mr-1.5" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" prefetch={false}>
                <Button variant="ghost" size="sm" className="h-9 text-base">Login</Button>
              </Link>
              <Link href="/register" prefetch={false}>
                <Button size="sm" className="h-9 text-base">Register</Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button and Unified Actions */}
        <div className="flex md:hidden items-center gap-0.5 sm:gap-1 ml-auto shrink-0">
          {user && (
            <Link href="/dashboard/notices" className="relative p-2 hover:bg-accent rounded-md transition-colors" prefetch={false}>
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full px-1.5 min-w-5 h-5 flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative p-2 hover:bg-accent rounded-md transition-colors flex items-center justify-center"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-accent rounded-md transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col p-4 space-y-4">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors"
              prefetch={false}
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Home</span>
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors"
                  prefetch={false}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>

                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors"
                    prefetch={false}
                  >
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="font-medium">Admin Dashboard</span>
                  </Link>
                )}

                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors"
                  prefetch={false}
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">Profile</span>
                </Link>

                <div className="pt-4 border-t">
                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2 border-t">
                <Link href="/login" onClick={() => setIsMenuOpen(false)} prefetch={false}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)} prefetch={false}>
                  <Button className="w-full">Register</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}