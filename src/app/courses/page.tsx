'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../store/slices/courseSlice';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { Course } from '../../types';
import { RootState, AppDispatch } from '../store/store';
import {
    Search,
    Filter,
    Zap,
    Clock,
    BookOpen
} from 'lucide-react';

export default function CoursesPage() {
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
        <div className="min-h-screen bg-background pt-20 pb-12">
            {/* Hero Section */}
            <section className="relative py-12 mb-12 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 -z-10" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-4">
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>Explore Our Catalog</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                            All <span className="gradient-text">Courses</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Discover your next skill with our wide range of professional courses taught by industry experts.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-between">
                    <div className="relative group w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-colors" />
                        <Input
                            type="text"
                            placeholder="Search courses..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 h-12 bg-white/5 border-white/10 rounded-2xl focus:border-primary/50 text-base"
                        />
                    </div>

                    <div className="flex items-center gap-3 glass px-1.5 rounded-2xl border-white/10 w-full md:w-72">
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
                            ]}
                            className="flex-1"
                            placeholder="Categories"
                        />
                    </div>
                </div>

                {/* Course Grid */}
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
                    <div className="text-center py-20 glass rounded-[2rem] border-red-500/20 max-w-xl mx-auto">
                        <p className="text-destructive text-xl font-semibold mb-4">Connection Issue</p>
                        <p className="text-muted-foreground mb-6">{error}</p>
                        <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl px-8 font-bold">Try Again</Button>
                    </div>
                )}

                {!loading && !error && courses.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {courses.map((course: Course, index: number) => (
                            <motion.div
                                key={course._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <Card className="glass-card h-full flex flex-col group hover:scale-[1.02] transition-all duration-500 rounded-[2rem] overflow-hidden border-white/5">
                                    <div className="absolute top-0 right-0 p-4 z-20">
                                        <span className="glass px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary border-primary/20">
                                            {course.category}
                                        </span>
                                    </div>

                                    <CardHeader className="relative z-10 pt-8">
                                        <CardTitle className="text-2xl font-black group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                            {course.title}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2 text-muted-foreground/80 mt-2 font-medium">
                                            {course.description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="relative z-10 flex-grow">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] text-white font-black shadow-lg">
                                                    {(() => {
                                                        const inst = course.instructors?.[0];
                                                        return (typeof inst === 'object' && inst !== null ? inst.name : 'Unknown').charAt(0);
                                                    })()}
                                                </div>
                                                <span className="line-clamp-1">
                                                    {(course.instructors || []).map(inst => typeof inst === 'object' && inst !== null ? inst.name : 'Unknown').join(', ')}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground/50">
                                                <span className="flex items-center gap-1.5">
                                                    <Zap className="h-3 w-3 text-primary" />
                                                    {course.lessons?.length || 0} Lessons
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="h-3 w-3 text-blue-400" />
                                                    {course.duration} Hours
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {course.tags.slice(0, 3).map((tag) => (
                                                    <span key={tag} className="bg-white/5 border border-white/10 text-muted-foreground px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="flex justify-between items-center relative z-10 p-6 pt-4 border-t border-white/5 mt-auto bg-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">Access Fee</span>
                                            <div className="flex items-baseline gap-0.5 leading-none">
                                                <span className="text-sm font-black text-primary">$</span>
                                                <span className="text-3xl font-black text-white tracking-tighter">{course.price}</span>
                                            </div>
                                        </div>
                                        <Link href={`/course/${course._id}`}>
                                            <Button className="rounded-xl px-6 h-12 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-neon transition-all duration-300 font-black text-xs uppercase tracking-widest border-none">
                                                Enroll Now
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {!loading && !error && courses.length === 0 && (
                    <div className="text-center py-20 glass rounded-[2.5rem] border-white/10">
                        <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                        <h3 className="text-2xl font-bold mb-2">No Courses Found</h3>
                        <p className="text-muted-foreground mb-8">Try adjusting your search or filters to find what you're looking for.</p>
                        <Button onClick={() => { setSearch(''); setCategory(''); }} variant="outline" className="rounded-xl font-bold">Clear Filters</Button>
                    </div>
                )}

                {!loading && !error && totalPages > 1 && (
                    <div className="mt-16 flex justify-center gap-3">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={page === currentPage ? "default" : "outline"}
                                className={`w-12 h-12 rounded-xl font-bold ${page === currentPage ? 'shadow-neon' : 'border-white/10'}`}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
