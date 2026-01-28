'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Megaphone, Clock, User, ChevronRight, X } from 'lucide-react';
import api from '../../../lib/axios';
import { Notice } from '../../../types';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { markReadByNoticeId, fetchNotifications } from '../../store/slices/notificationSlice';
import { DashboardSidebar } from '../../../components/DashboardSidebar';

export default function StudentNotices() {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
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
        <div className="min-h-screen bg-background">
            <div className="flex">
                <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

                {/* Main Content */}
                <div className="flex-1 overflow-x-hidden">
                    <div className="max-w-full mx-auto px-3 sm:px-4 md:px-8 py-8 relative">
                        {/* Blurred Decorative Background Elements - Hidden on mobile */}
                        <div className="hidden sm:block absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px] -z-0 pointer-events-none" />
                        <div className="hidden sm:block absolute bottom-40 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-0 pointer-events-none" />

                        <div className="mb-12 text-center md:text-left relative z-10">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                <div className="mb-4 inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl text-primary shadow-glow shadow-primary/20">
                                    <Megaphone className="h-8 w-8" />
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tighter gradient-text">Notice Board</h1>
                                <p className="text-lg text-muted-foreground/80 font-medium">Stay updated with the latest announcements</p>
                            </motion.div>
                        </div>

                        {loading ? (
                            <div className="space-y-6 relative z-10">
                                {[1, 2, 3].map(i => (
                                    <Card key={i} className="h-40 glass-card animate-pulse border-none shadow-premium rounded-2xl" />
                                ))}
                            </div>
                        ) : notices.length === 0 ? (
                            <Card className="glass-card border-none py-20 text-center relative z-10">
                                <CardContent>
                                    <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Megaphone className="h-10 w-10 text-primary opacity-30 shadow-glow" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 tracking-tight">No active notices</h3>
                                    <p className="text-muted-foreground max-w-sm mx-auto mb-8 text-lg">
                                        Check back later for any new announcements regarding your courses.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 relative z-10">
                                {notices.map((notice) => (
                                    <Card
                                        key={notice._id}
                                        className="group glass-card border-none overflow-hidden transition-all hover:translate-y-[-2px] hover:scale-[1.01] duration-500 relative z-10 border border-white/5"
                                    >
                                        <div className="h-1.5 bg-gradient-to-r from-primary to-primary/40" />
                                        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${notice.targetType === 'all'
                                                        ? 'bg-blue-100/10 text-blue-400 border-blue-400/20'
                                                        : 'bg-purple-100/10 text-purple-400 border-purple-400/20'
                                                        }`}>
                                                        {notice.targetType === 'all' ? 'General' : 'Course Update'}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold tracking-tight">
                                                        <Clock className="h-3.5 w-3.5 text-primary" />
                                                        {format(new Date(notice.createdAt), 'MMMM dd, yyyy')}
                                                    </span>
                                                </div>
                                                <CardTitle className="text-2xl font-black group-hover:text-primary transition-colors tracking-tight">
                                                    {notice.title}
                                                </CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-lg line-clamp-2 italic">
                                                "{notice.content}"
                                            </p>

                                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                                        <User className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                                        Admin Team
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => { setSelectedNotice(notice); dispatch(markReadByNoticeId(notice._id)); }}
                                                    className="text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs font-black uppercase tracking-tighter hover:underline"
                                                >
                                                    Read Full <ChevronRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
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
                                        className="relative w-full max-w-4xl glass-card overflow-hidden border border-white/10"
                                    >
                                        <div className="h-2 bg-gradient-to-r from-primary to-primary/40" />
                                        <div className="p-8 md:p-12 overflow-y-auto max-h-[85vh]">
                                            <div className="flex items-center gap-3 mb-6">
                                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${selectedNotice.targetType === 'all'
                                                    ? 'bg-blue-100/10 text-blue-400 border-blue-400/20'
                                                    : 'bg-purple-100/10 text-purple-400 border-purple-400/20'
                                                    }`}>
                                                    {selectedNotice.targetType === 'all' ? 'General' : 'Course Update'}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                                                    <Clock className="h-3.5 w-3.5 text-primary" />
                                                    {format(new Date(selectedNotice.createdAt), 'MMMM dd, yyyy')}
                                                </span>
                                            </div>

                                            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tighter">
                                                {selectedNotice.title}
                                            </h2>

                                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                                <p className="text-muted-foreground whitespace-pre-wrap break-words text-xl leading-relaxed font-medium">
                                                    {selectedNotice.content}
                                                </p>
                                            </div>

                                            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40">
                                                        <User className="h-6 w-6 text-primary shadow-glow shadow-primary/30" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-xs uppercase tracking-widest">Admin Team</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">CourseMaster Platform</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={() => setSelectedNotice(null)}
                                                    size="lg"
                                                    className="w-full sm:w-auto px-10 rounded-xl font-black shadow-xl shadow-primary/20"
                                                >
                                                    Close Notice
                                                </Button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setSelectedNotice(null)}
                                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors"
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
