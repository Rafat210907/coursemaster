'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchEnrolledCourses } from '../../store/slices/enrollmentSlice';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { BookOpen, HelpCircle, Trophy, PlayCircle, Menu, X, Megaphone } from 'lucide-react';
import { fetchNotifications } from '../../store/slices/notificationSlice';
import api from '../../../lib/axios';
import { Quiz, Course } from '../../../types';
import Link from 'next/link';

export default function DashboardQuizzes() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { enrollments, loading: enrollmentsLoading } = useSelector((state: RootState) => state.enrollments);
  const { unreadCount } = useSelector((state: RootState) => state.notifications);
  const [quizzes, setQuizzes] = useState<{ quiz: Quiz, courseTitle: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchEnrolledCourses());
      dispatch(fetchNotifications());
    }
  }, [dispatch, user]);

  useEffect(() => {
    const fetchAllQuizzes = async () => {
      if (!enrollments || enrollments.length === 0) {
        if (!enrollmentsLoading) setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const quizPromises = enrollments.map(async (enrollment) => {
          if (!enrollment.course) return [];
          const courseData = enrollment.course as Course;
          const courseId = typeof enrollment.course === 'object' ? courseData._id : enrollment.course;
          const courseTitle = typeof enrollment.course === 'object' ? courseData.title : 'Course';

          try {
            const response = await api.get(`/quizzes/course/${courseId}`);
            return response.data.map((q: Quiz) => ({ quiz: q, courseTitle }));
          } catch (err) {
            console.error(`Error fetching quizzes for course ${courseId}:`, err);
            return [];
          }
        });

        const results = await Promise.all(quizPromises);
        const allQuizzes = results.flat();

        // Use a map to handle duplicates just in case
        const uniqueQuizzesMap = new Map();
        allQuizzes.forEach(item => {
          if (!uniqueQuizzesMap.has(item.quiz._id)) {
            uniqueQuizzesMap.set(item.quiz._id, item);
          }
        });

        setQuizzes(Array.from(uniqueQuizzesMap.values()));
      } catch (error) {
        console.error('Error fetching all quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    if (enrollments && enrollments.length > 0) {
      fetchAllQuizzes();
    } else if (!enrollmentsLoading) {
      setLoading(false);
    }
  }, [enrollments, enrollmentsLoading]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">Please login to view your quizzes.</p>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
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
            <h2 className="text-lg font-semibold mb-6">CourseMaster</h2>
            <nav className="space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                <BookOpen className="h-5 w-5" />
                My Courses
              </Link>
              <Link
                href="/dashboard/quizzes"
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-primary-foreground shadow-sm"
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
        <div className="flex-1 relative overflow-x-hidden">
          {/* Blurred Decorative Background Elements - Hidden on mobile */}
          <div className="hidden sm:block absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px] -z-0 pointer-events-none" />
          <div className="hidden sm:block absolute bottom-40 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-0 pointer-events-none" />

          <div className="max-w-full mx-auto px-3 sm:px-4 md:px-6 py-8 relative z-10">
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">My Quizzes</h1>
              <p className="text-lg md:text-xl text-muted-foreground">Challenge yourself and master your subjects</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse border-none shadow-md overflow-hidden bg-card/30 backdrop-blur-md">
                    <div className="h-32 bg-muted/50" />
                    <CardContent className="h-24 p-6" />
                  </Card>
                ))}
              </div>
            ) : quizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {quizzes.map(({ quiz, courseTitle }) => {
                  const submission = quiz.submissions?.find(s =>
                    (typeof s.student === 'string' ? s.student : s.student?._id) === user._id
                  );

                  return (
                    <Card key={quiz._id} className="group hover:shadow-premium transition-all duration-300 border-none shadow-md overflow-hidden bg-card/30 backdrop-blur-2xl border border-white/5 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                      <div className="h-1.5 bg-gradient-to-r from-primary to-primary/40" />
                      <CardHeader className="pb-4 relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-primary/10 text-primary rounded-full">
                            {courseTitle}
                          </span>
                          {submission && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-600 rounded-full border border-green-500/20">
                              <Trophy size={14} className="fill-green-600/20" />
                              <span className="text-xs font-bold">
                                {Math.round((submission.score / quiz.questions.length) * 100)}%
                              </span>
                            </div>
                          )}
                        </div>
                        <CardTitle className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                          {quiz.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {quiz.questions.length} Questions • Estimated 10 mins
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 relative z-10">
                        <Link href={`/lesson/${quiz.course || '#'}`}>
                          <Button className="w-full group-hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20">
                            <PlayCircle className="h-4 w-4 mr-2" />
                            {submission ? 'Retake Quiz' : 'Start Assessment'}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="text-center py-20 border-none border-muted bg-card/30 backdrop-blur-sm shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
                <CardContent className="relative z-10">
                  <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <HelpCircle className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">No quizzes found</h3>
                  <p className="text-muted-foreground/80 max-w-sm mx-auto mb-8 text-lg">
                    Once you enroll in courses that have assessments, they will appear here.
                  </p>
                  <Link href="/dashboard">
                    <Button size="lg" className="px-8 shadow-xl shadow-primary/20">Explore My Courses</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}