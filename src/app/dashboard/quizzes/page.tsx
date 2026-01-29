'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchEnrolledCourses } from '../../store/slices/enrollmentSlice';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { HelpCircle, Trophy, PlayCircle, Clock } from 'lucide-react';
import { fetchNotifications } from '../../store/slices/notificationSlice';
import api from '../../../lib/axios';
import { Quiz, Course, QuizRanking } from '../../../types';
import Link from 'next/link';
import { DashboardSidebar } from '../../../components/DashboardSidebar';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isAfter, subHours } from 'date-fns';
import { Layout, CheckCircle2, Circle, TrendingUp, User as UserIcon } from 'lucide-react';

export default function DashboardQuizzes() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { enrollments, loading: enrollmentsLoading } = useSelector((state: RootState) => state.enrollments);
  const [quizzes, setQuizzes] = useState<{ quiz: Quiz, courseTitle: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'completed' | 'not-started' | 'ranking'>('all');
  const [rankings, setRankings] = useState<QuizRanking[]>([]);
  const [rankingLoading, setRankingLoading] = useState(false);

  const filteredQuizzes = quizzes.filter(({ quiz }) => {
    const submission = quiz.submissions?.find(s =>
      (typeof s.student === 'string' ? s.student : s.student?._id) === user?._id
    );

    if (filter === 'all' || filter === 'ranking') return true;
    if (filter === 'completed') return !!submission;
    if (filter === 'not-started') return !submission;
    return true;
  }).sort((a, b) => {
    const dateA = a.quiz.createdAt ? new Date(a.quiz.createdAt).getTime() : 0;
    const dateB = b.quiz.createdAt ? new Date(b.quiz.createdAt).getTime() : 0;
    return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
  });

  const fetchRankings = async () => {
    setRankingLoading(true);
    try {
      const response = await api.get('/quizzes/rankings');
      setRankings(response.data);
    } catch (error) {
      console.error('Error fetching rankings:', error);
    } finally {
      setRankingLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      dispatch(fetchEnrolledCourses());
      dispatch(fetchNotifications());
    }

    // Check for initial filter in URL
    const params = new URLSearchParams(window.location.search);
    const initialFilter = params.get('filter');
    if (initialFilter && ['all', 'completed', 'not-started', 'ranking'].includes(initialFilter)) {
      setFilter(initialFilter as 'all' | 'completed' | 'not-started' | 'ranking');
      if (initialFilter === 'ranking') fetchRankings();
    }

    const handleFilterChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setFilter(customEvent.detail);
      if (customEvent.detail === 'ranking') fetchRankings();
    };

    window.addEventListener('quizFilterChange', handleFilterChange);
    return () => window.removeEventListener('quizFilterChange', handleFilterChange);
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
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tighter gradient-text">
                  {filter === 'ranking' ? 'Student Rankings' : 'My Quizzes'}
                </h1>
                <p className="text-lg text-muted-foreground/80 font-medium">
                  {filter === 'ranking'
                    ? 'Top performers in our community'
                    : 'Challenge yourself and master your subjects'}
                </p>
              </motion.div>

              {/* Enhanced Sidebar/Filter Nav (Integrated into main view for mobile/desktop toggle feel) */}
              <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl mx-auto md:mx-0 w-fit">
                {[
                  { id: 'all', label: 'All', icon: Layout },
                  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
                  { id: 'not-started', label: 'Not Started', icon: Circle },
                  { id: 'ranking', label: 'Ranking', icon: TrendingUp }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setFilter(item.id as 'all' | 'completed' | 'not-started' | 'ranking');
                      if (item.id === 'ranking' && rankings.length === 0) {
                        fetchRankings();
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === item.id
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                      }`}
                  >
                    <item.icon size={16} />
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {filter === 'ranking' ? (
                <motion.div
                  key="rankings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {rankingLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-20 w-full glass-card animate-pulse rounded-2xl" />
                      ))}
                    </div>
                  ) : (
                    <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden shadow-2xl">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-muted-foreground">Rank</th>
                              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-muted-foreground">Student</th>
                              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-muted-foreground text-right">Quizzes Completed</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {rankings.map((rank, index) => (
                              <tr key={rank._id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-8 py-6">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                                    index === 1 ? 'bg-slate-300/20 text-slate-300' :
                                      index === 2 ? 'bg-amber-700/20 text-amber-700' :
                                        'bg-white/5 text-muted-foreground'
                                    }`}>
                                    {index + 1}
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-primary/20 border border-primary/20 overflow-hidden flex items-center justify-center">
                                      {rank.profileImage ? (
                                        <Image src={rank.profileImage} alt={rank.name} width={48} height={48} className="h-full w-full object-cover" unoptimized />
                                      ) : (
                                        <UserIcon className="h-6 w-6 text-primary" />
                                      )}
                                    </div>
                                    <span className="font-bold text-lg">{rank.name}</span>
                                  </div>
                                </td>
                                <td className="px-8 py-6 text-right font-black text-2xl tabular-nums gradient-text">
                                  {rank.completedQuizzes}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="quizzes"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse glass-card h-80 border-none shadow-premium overflow-hidden rounded-[2rem]">
                        </Card>
                      ))}
                    </div>
                  ) : filteredQuizzes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredQuizzes.map(({ quiz, courseTitle }) => {
                        const submission = quiz.submissions?.find(s =>
                          (typeof s.student === 'string' ? s.student : s.student?._id) === user._id
                        );

                        const quizDate = quiz.createdAt ? new Date(quiz.createdAt) : null;
                        const isNew = quizDate && !isNaN(quizDate.getTime())
                          ? isAfter(quizDate, subHours(new Date(), 48))
                          : false;

                        return (
                          <Card key={quiz._id} className="group glass-card h-full flex flex-col hover:scale-[1.02] transition-all duration-500 border-white/5 relative rounded-[2rem] overflow-hidden">
                            <div className="h-1.5 bg-gradient-to-r from-primary to-primary/40" />
                            <CardHeader className="pb-4 relative z-10">
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex flex-wrap gap-2">
                                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
                                    {courseTitle}
                                  </span>
                                  {isNew && (
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-red-500/20 text-red-500 rounded-full border border-red-500/20 animate-pulse">
                                      New
                                    </span>
                                  )}
                                </div>
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
                              <div className="flex flex-col gap-1 mt-3">
                                <p className="text-[10px] text-muted-foreground/50 font-black uppercase tracking-tighter flex items-center gap-1.5">
                                  <Clock size={12} />
                                  Created: {quiz.createdAt ? format(new Date(quiz.createdAt), 'MMM d, yyyy') : 'Recently'}
                                </p>
                                {submission && submission.submittedAt && (
                                  <p className="text-[10px] text-green-500/50 font-black uppercase tracking-tighter flex items-center gap-1.5">
                                    <CheckCircle2 size={12} />
                                    Completed: {format(new Date(submission.submittedAt), 'MMM d, yyyy')}
                                  </p>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0 relative z-10 flex-grow mt-2">
                              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-4 group-hover:border-primary/20 transition-all duration-500">
                                <p className="text-[10px] text-muted-foreground font-black tracking-widest uppercase mb-1 flex items-center gap-2">
                                  <HelpCircle size={12} className="text-primary" />
                                  Assessment Status
                                </p>
                                <p className="text-xl font-black tracking-tight">
                                  {submission ? `Score: ${submission.score}/${quiz.questions.length}` : 'Not Started'}
                                </p>
                              </div>
                            </CardContent>
                            <div className="p-6 pt-0 relative z-10">
                              <Link href={`/lesson/${quiz.course || '#'}/quizzes`}>
                                <Button className="w-full h-12 rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/30 transition-all font-black text-xs uppercase tracking-widest">
                                  <PlayCircle className="h-4 w-4 mr-2" />
                                  {submission ? 'Review Results' : 'Start Assessment'}
                                </Button>
                              </Link>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <Card className="glass-card border-none py-28 text-center rounded-[3rem]">
                      <CardContent className="relative z-10">
                        <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow shadow-primary/20 border border-primary/20">
                          <HelpCircle className="h-12 w-12 text-primary" />
                        </div>
                        <h3 className="text-3xl font-black mb-3 tracking-tighter">No quizzes found</h3>
                        <p className="text-muted-foreground/80 max-w-sm mx-auto mb-8 text-lg font-medium leading-relaxed">
                          We couldn&apos;t find any {filter !== 'all' ? filter.replace('-', ' ') : ''} quizzes for you.
                        </p>
                        <Link href="/dashboard">
                          <Button size="lg" className="px-12 h-14 rounded-2xl shadow-2xl shadow-primary/20 font-black uppercase tracking-widest text-xs">Explore My Courses</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}