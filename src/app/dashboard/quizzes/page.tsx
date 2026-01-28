'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchEnrolledCourses } from '../../store/slices/enrollmentSlice';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { HelpCircle, Trophy, PlayCircle, Clock } from 'lucide-react';
import { fetchNotifications } from '../../store/slices/notificationSlice';
import api from '../../../lib/axios';
import { Quiz, Course } from '../../../types';
import Link from 'next/link';
import { DashboardSidebar } from '../../../components/DashboardSidebar';
import { motion } from 'framer-motion';

export default function DashboardQuizzes() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { enrollments, loading: enrollmentsLoading } = useSelector((state: RootState) => state.enrollments);
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
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* Main Content */}
        <div className="flex-1 relative overflow-x-hidden">
          {/* Blurred Decorative Background Elements - Hidden on mobile */}
          <div className="hidden sm:block absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px] -z-0 pointer-events-none" />
          <div className="hidden sm:block absolute bottom-40 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-0 pointer-events-none" />

          <div className="max-w-full mx-auto px-3 sm:px-4 md:px-8 py-8 relative z-10">
            <div className="mb-12 text-center md:text-left">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tighter gradient-text">My Quizzes</h1>
                <p className="text-lg text-muted-foreground/80 font-medium">Challenge yourself and master your subjects</p>
              </motion.div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse glass-card h-64 border-none shadow-premium overflow-hidden">
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
                    <Card key={quiz._id} className="group glass-card h-full flex flex-col hover:scale-[1.02] transition-all duration-500 border-white/5 relative">
                      <div className="h-1.5 bg-gradient-to-r from-primary to-primary/40" />
                      <CardHeader className="pb-4 relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
                            {courseTitle}
                          </span>
                          {submission && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20 shadow-glow shadow-green-500/20">
                              <Trophy size={14} className="fill-green-400/20" />
                              <span className="text-xs font-bold">
                                {Math.round((submission.score / quiz.questions.length) * 100)}%
                              </span>
                            </div>
                          )}
                        </div>
                        <CardTitle className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                          {quiz.title}
                        </CardTitle>
                        <CardDescription className="text-sm font-medium text-muted-foreground/70 flex items-center gap-2 mt-2">
                          <HelpCircle className="h-4 w-4" />
                          {quiz.questions.length} Questions • Estimated 10 mins
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 relative z-10 flex-grow">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 mb-4 group-hover:border-primary/20 transition-colors">
                          <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-1">Last Score</p>
                          <p className="text-lg font-black">{submission ? `${submission.score}/${quiz.questions.length}` : 'Not Started'}</p>
                        </div>
                      </CardContent>
                      <div className="p-6 pt-0 relative z-10">
                        <Link href={`/lesson/${quiz.course || '#'}`}>
                          <Button className="w-full h-11 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-bold">
                            <PlayCircle className="h-4 w-4 mr-2" />
                            {submission ? 'Retake Quiz' : 'Start Assessment'}
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="glass-card border-none py-20 text-center">
                <CardContent className="relative z-10">
                  <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow shadow-primary/20">
                    <HelpCircle className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">No quizzes found</h3>
                  <p className="text-muted-foreground/80 max-w-sm mx-auto mb-8 text-lg">
                    Once you enroll in courses that have assessments, they will appear here.
                  </p>
                  <Link href="/dashboard">
                    <Button size="lg" className="px-10 rounded-xl shadow-xl shadow-primary/20">Explore My Courses</Button>
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