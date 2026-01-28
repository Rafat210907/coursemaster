'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from './store/slices/courseSlice';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CustomSelect } from '../components/ui/CustomSelect';
import { Course } from '../types';
import { RootState, AppDispatch } from './store/store';
import { Search, Filter, BookOpen, Clock, Users, ArrowRight } from 'lucide-react';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading, error, totalPages, currentPage } = useSelector((state: RootState) => state.courses);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    dispatch(fetchCourses({ page: 1, search, category }));
  }, [dispatch, search, category]);

  const handlePageChange = (page: number) => {
    dispatch(fetchCourses({ page, search, category }));
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative bg-dot-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative">
        {/* Animated Decorative Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] -z-0 pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] -z-0 pointer-events-none animate-float" />
        <div className="relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16 relative"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Welcome to <span className="gradient-text neon-glow">CourseMaster</span>
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed font-light">
              Elevate your expertise with masterclasses from industry leaders. Discover, learn, and grow.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4 mb-12 relative z-40 items-center justify-center search-filter-container">
            <div className="relative flex-1 max-w-lg group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                placeholder="Search courses by title, instructor, or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-12 bg-white/5 border-white/10 rounded-2xl focus:border-primary/50 transition-all text-lg"
              />
            </div>
            <div className="flex items-center gap-3 glass px-1.5 rounded-2xl border-white/10 min-w-[280px]">
              <div className="pl-3">
                <Filter className="h-5 w-5 text-muted-foreground" />
              </div>
              <CustomSelect
                value={category}
                onChange={(val) => setCategory(val)}
                options={[
                  { value: '', label: 'All Categories' },
                  { value: 'programming', label: 'Programming' },
                  { value: 'design', label: 'Design' },
                  { value: 'business', label: 'Business' },
                  { value: 'marketing', label: 'Marketing' },
                  { value: 'data-science', label: 'Data Science' },
                  { value: 'photography', label: 'Photography' },
                ]}
                className="flex-1"
                placeholder="Categories"
              />
            </div>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="glass-card h-full min-h-[420px] flex flex-col">
                  <CardHeader className="pt-8">
                    <Skeleton height={32} baseColor="#110d18" highlightColor="#221a31" borderRadius={12} />
                    <Skeleton height={20} width="60%" baseColor="#110d18" highlightColor="#221a31" borderRadius={8} className="mt-2" />
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <Skeleton count={3} baseColor="#110d18" highlightColor="#221a31" borderRadius={8} className="mb-2" />
                  </CardContent>
                  <CardFooter className="mt-auto p-6 pt-0 border-t border-white/5 space-y-4 flex flex-col items-stretch">
                    <div className="flex justify-between items-center w-full mt-4">
                      <Skeleton height={40} width={80} baseColor="#110d18" highlightColor="#221a31" borderRadius={12} />
                      <Skeleton height={48} width={140} baseColor="#110d18" highlightColor="#221a31" borderRadius={16} />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-20 glass rounded-3xl border-red-500/20 max-w-xl mx-auto">
              <p className="text-destructive text-xl font-semibold mb-4">Connection Issue</p>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
            </div>
          )}

          {!loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {courses.map((course: Course, index: number) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                >
                  <Card className="glass-card h-full flex flex-col group hover:scale-[1.02] transition-all duration-500 rounded-3xl overflow-hidden border-white/5">
                    <div className="absolute top-0 right-0 p-4 z-20">
                      <span className="glass px-3 py-1 rounded-full text-xs font-semibold text-primary-foreground border-primary/20">
                        {course.category}
                      </span>
                    </div>

                    <CardHeader className="relative z-10 pt-8">
                      <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-muted-foreground/80 mt-2">
                        {course.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="relative z-10 flex-grow">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] text-white font-bold">
                            {(() => {
                              const inst = course.instructors?.[0];
                              return (typeof inst === 'object' && inst !== null ? inst.name : 'Unknown').charAt(0);
                            })()}
                          </div>
                          <span className="line-clamp-1">
                            {(course.instructors || []).map(inst => typeof inst === 'object' && inst !== null ? inst.name : 'Unknown').join(', ')}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground/60">
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {course.lessons?.length || 0} Lessons
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            {course.duration} Hours
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          {course.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="bg-white/5 border border-white/5 text-muted-foreground/90 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-between items-center relative z-10 p-6 pt-4 border-t border-white/5 mt-auto">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black opacity-60">Price</span>
                        <div className="flex items-baseline gap-0.5 leading-none">
                          <span className="text-sm font-bold text-primary">$</span>
                          <span className="text-2xl font-black text-white tracking-tighter">{course.price}</span>
                        </div>
                      </div>
                      <Link href={`/course/${course._id}`}>
                        <Button className="rounded-2xl px-8 h-11 bg-primary hover:bg-primary/90 shadow-[0_8px_20px_-5px_rgba(139,92,246,0.4)] group transition-all duration-300 font-bold border-none text-sm">
                          Enroll Now
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}


          {!loading && !error && totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
