'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEnrolledCourses } from '../store/slices/enrollmentSlice';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { RootState, AppDispatch } from '../store/store';
import { Enrollment, Course } from '../../types';
import { BookOpen, TrendingUp, Clock, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardSidebar } from '../../components/DashboardSidebar';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { enrollments, loading } = useSelector((state: RootState) => state.enrollments);
  const { user } = useSelector((state: RootState) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchEnrolledCourses());
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
        <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* Main Content */}
        <div className="flex-1 overflow-x-hidden">
          <div className="max-w-full mx-auto px-3 sm:px-4 py-8 relative">
            {/* Blurred Decorative Background Elements - Hidden on mobile */}
            <div className="hidden sm:block absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px] -z-0 pointer-events-none" />
            <div className="hidden sm:block absolute bottom-40 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-0 pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tighter gradient-text">Welcome back, {user.name}!</h1>
                <p className="text-lg text-muted-foreground/80 font-medium">Continue your learning journey with passion.</p>
              </motion.div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 relative z-10">
              <Card className="group glass-card border-none overflow-hidden transition-all hover:translate-y-[-2px]">
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <BookOpen className="h-8 w-8 text-primary shadow-glow" />
                    <div>
                      <p className="text-2xl font-bold">{enrollments.length}</p>
                      <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group glass-card border-none overflow-hidden transition-all hover:translate-y-[-2px]">
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <TrendingUp className="h-8 w-8 text-green-400 shadow-glow" />
                    <div>
                      <p className="text-2xl font-bold">{inProgressCourses}</p>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group glass-card border-none overflow-hidden transition-all hover:translate-y-[-2px]">
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <Award className="h-8 w-8 text-yellow-500 shadow-glow" />
                    <div>
                      <p className="text-2xl font-bold">{completedCourses}</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group glass-card border-none overflow-hidden transition-all hover:translate-y-[-2px]">
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <Clock className="h-8 w-8 text-blue-400 shadow-glow" />
                    <div>
                      <p className="text-2xl font-bold">{totalProgress.toFixed(0)}%</p>
                      <p className="text-sm text-muted-foreground">Avg Progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enrolled Courses */}
            <div className="mb-8 relative z-10">
              <h2 className="text-2xl font-bold mb-6 tracking-tight">My Courses</h2>
              {validEnrollments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {validEnrollments.map((enrollment: Enrollment) => (
                    <Card key={enrollment._id} className="group glass-card h-full flex flex-col hover:scale-[1.02] transition-all duration-500 border-white/5">
                      <div className="h-1.5 bg-gradient-to-r from-primary to-primary/40" />
                      <CardHeader className="relative z-10">
                        <CardTitle className="line-clamp-2 text-xl font-bold">{(enrollment.course as Course)?.title || 'Unknown Course'}</CardTitle>
                        <CardDescription className="text-muted-foreground/70">
                          {(() => {
                            const course = enrollment.course as Course;
                            const instructors = course?.instructors || [];
                            const instructorNames = instructors.map(inst => typeof inst === 'object' && inst !== null ? inst.name : 'Unknown').join(', ');
                            return instructorNames || 'Unknown Instructor';
                          })()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="relative z-10 flex-grow">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-xs font-bold mb-2 tracking-wider">
                              <span>PROGRESS</span>
                              <span className="text-primary">{enrollment.progress}%</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-500 shadow-glow shadow-primary/30"
                                style={{ width: `${enrollment.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{enrollment.status}</span>
                          </div>
                        </div>
                      </CardContent>
                      <div className="p-6 pt-0 relative z-10">
                        <Link href={(enrollment.course as Course) ? `/lesson/${(enrollment.course as Course)._id}` : '#'}>
                          <Button className="w-full h-11 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-bold" disabled={!(enrollment.course as Course)}>
                            {enrollment.progress === 100 ? 'Review Course' : 'Continue Learning'}
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="glass-card border-none py-16 text-center">
                  <CardContent className="relative z-10">
                    <BookOpen className="h-16 w-16 text-primary mb-6 mx-auto shadow-glow" />
                    <h3 className="text-2xl font-bold mb-3 tracking-tight">No courses yet</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto mb-8 text-lg">
                      Start your learning journey by enrolling in a course.
                    </p>
                    <Link href="/">
                      <Button size="lg" className="px-10 rounded-xl shadow-xl shadow-primary/20">Browse Courses</Button>
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