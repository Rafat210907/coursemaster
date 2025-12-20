'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Megaphone, BookOpen, HelpCircle, Menu, X, Clock, User, ChevronRight } from 'lucide-react';
import api from '../../../lib/axios';
import { Notice } from '../../../types';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { markReadByNoticeId, fetchNotifications } from '../../store/slices/notificationSlice';

export default function StudentNotices() {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { unreadCount } = useSelector((state: RootState) => state.notifications);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

    useEffect(() => {
        if (user) {
            fetchNotices();
            dispatch(fetchNotifications());
        }
    }, [user, dispatch]);

    const fetchNotices = async () => {
        setLoading(true);
        try {
            const response = await api.get('/notices/student');
            setNotices(response.data);
        } catch (error) {
            console.error('Error fetching notices:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

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
                        <h2 className="text-lg font-semibold mb-6 text-primary flex items-center gap-2">
                            CourseMaster
                        </h2>
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
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <HelpCircle className="h-5 w-5" />
                                Quizzes
                            </Link>
                            <Link
                                href="/dashboard/notices"
                                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20"
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
                    <div className="max-w-full mx-auto px-3 sm:px-4 md:px-8 py-8">
                        <div className="mb-10 text-center md:text-left">
                            <div className="mb-4 inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl text-primary md:mx-0 mx-auto">
                                <Megaphone className="h-8 w-8" />
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Notice Board</h1>
                            <p className="text-xl text-muted-foreground">Stay updated with the latest announcements</p>
                        </div>

                        {loading ? (
                            <div className="space-y-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-40 bg-muted animate-pulse rounded-2xl" />
                                ))}
                            </div>
                        ) : notices.length === 0 ? (
                            <Card className="text-center py-20 border-none shadow-premium bg-card/60 backdrop-blur-sm">
                                <CardContent>
                                    <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Megaphone className="h-10 w-10 text-muted-foreground opacity-30" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 tracking-tight">No active notices</h3>
                                    <p className="text-muted-foreground max-w-sm mx-auto mb-8 text-lg">
                                        Check back later for any new announcements regarding your courses.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 relative">
                                {notices.map((notice) => (
                                    <Card
                                        key={notice._id}
                                        className="group border-none shadow-premium overflow-hidden transition-all hover:translate-y-[-2px] bg-card/30 backdrop-blur-2xl relative z-10 border border-white/5"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                                        <div className="h-1.5 bg-gradient-to-r from-primary to-primary/40" />
                                        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${notice.targetType === 'all'
                                                        ? 'bg-blue-100 text-blue-600'
                                                        : 'bg-purple-100 text-purple-600'
                                                        }`}>
                                                        {notice.targetType === 'all' ? 'General' : 'Course Update'}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        {format(new Date(notice.createdAt), 'MMMM dd, yyyy')}
                                                    </span>
                                                </div>
                                                <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                                                    {notice.title}
                                                </CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-lg line-clamp-3">
                                                {notice.content}
                                            </p>

                                            <div className="mt-8 pt-6 border-t border-muted flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <User className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <span className="text-sm font-bold truncate">
                                                        Admin Team
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => { setSelectedNotice(notice); dispatch(markReadByNoticeId(notice._id)); }}
                                                    className="text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-sm font-black uppercase tracking-tighter hover:underline"
                                                >
                                                    Read Full <ChevronRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                {/* Blurred Decorative Background Elements */}
                                <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px] -z-0" />
                                <div className="absolute bottom-40 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-0" />
                            </div>
                        )}

                        {/* NOTICE MODAL */}
                        <AnimatePresence>
                            {selectedNotice && (
                                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setSelectedNotice(null)}
                                        className="absolute inset-0 bg-background/80 backdrop-blur-md"
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                        className="relative w-full max-w-6xl bg-card rounded-3xl shadow-2xl overflow-hidden border border-border"
                                    >
                                        <div className="h-2 bg-gradient-to-r from-primary to-primary/40" />
                                        <div className="p-8 md:p-12 overflow-y-auto max-h-[80vh]">
                                            <div className="flex items-center gap-3 mb-6">
                                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${selectedNotice.targetType === 'all'
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : 'bg-purple-100 text-purple-600'
                                                    }`}>
                                                    {selectedNotice.targetType === 'all' ? 'General' : 'Course Update'}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {format(new Date(selectedNotice.createdAt), 'MMMM dd, yyyy')}
                                                </span>
                                            </div>

                                            <h2 className="text-3xl md:text-4xl font-black mb-8 leading-tight">
                                                {selectedNotice.title}
                                            </h2>

                                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                                <p className="text-muted-foreground whitespace-pre-wrap break-words text-lg leading-relaxed">
                                                    {selectedNotice.content}
                                                </p>
                                            </div>

                                            <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <User className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-sm uppercase tracking-wider">Admin Team</p>
                                                        <p className="text-xs text-muted-foreground">CourseMaster Platform</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={() => setSelectedNotice(null)}
                                                    size="lg"
                                                    className="w-full sm:w-auto px-10 rounded-xl"
                                                >
                                                    Close Notice
                                                </Button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setSelectedNotice(null)}
                                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-accent transition-colors"
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
