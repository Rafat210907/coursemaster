'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEnrolledCourses } from '../store/slices/enrollmentSlice';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { RootState, AppDispatch } from '../store/store';
import { Enrollment, Course } from '../../types';
import { BookOpen, TrendingUp, Clock, Award, HelpCircle, Menu, X, Megaphone, Bell, ChevronRight } from 'lucide-react';
import { fetchNotifications } from '../store/slices/notificationSlice';
import { useState } from 'react';
// import { AnimatePresence, motion } from 'framer-motion';
// import { AnimatePresence, motion } from 'framer-motion';
// import { format } from 'date-fns';
// import { markRead, markReadByNoticeId } from '../store/slices/notificationSlice';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { enrollments, loading } = useSelector((state: RootState) => state.enrollments);
  const { user } = useSelector((state: RootState) => state.auth);
  const { unreadCount, notifications } = useSelector((state: RootState) => state.notifications);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchEnrolledCourses());
      dispatch(fetchNotifications());
    }
  }, [dispatch, user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">Please login to view your dashboard.</p>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const completedCourses = enrollments.filter(e => e.status === 'completed').length;
  const inProgressCourses = enrollments.filter(e => e.status === 'active').length;
  const totalProgress = enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length || 0;

  // Filter out enrollments with missing or invalid courses
  const validEnrollments = enrollments.filter(enrollment => enrollment.course && (enrollment.course as Course)?.title);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-2xl hover:scale-105 transition-transform"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Sidebar Backdrop */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar */}
        <div className={`
          fixed lg:relative inset-y-0 left-0 z-40
          w-64 bg-card border-r min-h-screen transition-transform duration-300 transform
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-6">Dashboard</h2>
            <nav className="space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-primary-foreground"
                onClick={() => setIsSidebarOpen(false)}
              >
                <BookOpen className="h-5 w-5" />
                My Courses
              </Link>
              <Link
                href="/dashboard/quizzes"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                <HelpCircle className="h-5 w-5" />
                Quizzes
              </Link>
              <Link
                href="/dashboard/notices"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Megaphone className="h-5 w-5" />
                Notice Board
                {unreadCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-x-hidden">
          <div className="max-w-full mx-auto px-3 sm:px-4 py-8 relative">
            {/* Blurred Decorative Background Elements - Hidden on mobile */}
            <div className="hidden sm:block absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px] -z-0 pointer-events-none" />
            <div className="hidden sm:block absolute bottom-40 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-0 pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
                <p className="text-muted-foreground">Continue your learning journey</p>
              </div>
            </div>

            {/* Stats Cards */}
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 relative z-10">
              <Card className="group border-none shadow-premium overflow-hidden transition-all hover:translate-y-[-2px] bg-card/30 backdrop-blur-2xl border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{enrollments.length}</p>
                      <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group border-none shadow-premium overflow-hidden transition-all hover:translate-y-[-2px] bg-card/30 backdrop-blur-2xl border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{inProgressCourses}</p>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group border-none shadow-premium overflow-hidden transition-all hover:translate-y-[-2px] bg-card/30 backdrop-blur-2xl border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <Award className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold">{completedCourses}</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group border-none shadow-premium overflow-hidden transition-all hover:translate-y-[-2px] bg-card/30 backdrop-blur-2xl border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <Clock className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{totalProgress.toFixed(0)}%</p>
                      <p className="text-sm text-muted-foreground">Avg Progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enrolled Courses */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">My Courses</h2>
              {validEnrollments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {validEnrollments.map((enrollment: Enrollment) => (
                    <Card key={enrollment._id} className="group border-none shadow-premium overflow-hidden transition-all hover:translate-y-[-2px] bg-card/30 backdrop-blur-2xl border border-white/5 relative z-10">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                      <div className="h-1.5 bg-gradient-to-r from-primary to-primary/40" />
                      <CardHeader className="relative z-10">
                        <CardTitle className="line-clamp-2">{(enrollment.course as Course)?.title || 'Unknown Course'}</CardTitle>
                        <CardDescription>
                          {(() => {
                            const course = enrollment.course as Course;
                            const instructors = course?.instructors || [];
                            const instructorNames = instructors.map(inst => typeof inst === 'object' && inst !== null ? inst.name : 'Unknown').join(', ');
                            return instructorNames || 'Unknown Instructor';
                          })()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span>{enrollment.progress}%</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${enrollment.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Status: {enrollment.status}</span>
                          </div>
                        </div>
                      </CardContent>
                      <div className="p-6 pt-0 relative z-10">
                        <Link href={(enrollment.course as Course) ? `/lesson/${(enrollment.course as Course)._id}` : '#'}>
                          <Button className="w-full" disabled={!(enrollment.course as Course)}>
                            {enrollment.progress === 100 ? 'Review Course' : 'Continue Learning'}
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-none shadow-premium bg-card/30 backdrop-blur-2xl border border-white/5 relative z-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                  <CardContent className="p-8 text-center relative z-10">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                    <p className="text-muted-foreground mb-4">Start your learning journey by enrolling in a course.</p>
                    <Link href="/">
                      <Button>Browse Courses</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}