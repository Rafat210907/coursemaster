'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from '../../../components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Megaphone, Plus, Trash2, Users, BookOpen, Clock, Loader2, ChevronRight, X, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../../../lib/axios';
import { Course, Notice } from '../../../types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdminNotices() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [targetType, setTargetType] = useState<'all' | 'course'>('all');
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [noticesRes, coursesRes] = await Promise.all([
                api.get('/notices'),
                api.get('/courses?limit=100')
            ]);
            setNotices(noticesRes.data);
            setCourses(coursesRes.data.courses || []);
        } catch (error) {
            console.error('Error fetching notices data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            toast.error('Title and content are required');
            return;
        }

        if (targetType === 'course' && selectedCourses.length === 0) {
            toast.error('Please select at least one course');
            return;
        }

        setCreating(true);
        try {
            await api.post('/notices', {
                title,
                content,
                targetType,
                targetCourses: targetType === 'course' ? selectedCourses : []
            });
            toast.success('Notice created successfully!');
            setShowForm(false);
            setTitle('');
            setContent('');
            setTargetType('all');
            setSelectedCourses([]);
            fetchData();
        } catch (error) {
            console.error('Error creating notice:', error);
            toast.error('Failed to create notice');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this notice?')) return;

        try {
            await api.delete(`/notices/${id}`);
            toast.success('Notice deleted');
            setNotices(notices.filter(n => n._id !== id));
        } catch (error) {
            console.error('Error deleting notice:', error);
            toast.error('Failed to delete notice');
        }
    };

    const toggleCourseSelection = (courseId: string) => {
        setSelectedCourses(prev =>
            prev.includes(courseId)
                ? prev.filter(id => id !== courseId)
                : [...prev, courseId]
        );
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="flex">
                <AdminSidebar />
                <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 rounded-2xl">
                                    <Megaphone className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold">Notice Board</h1>
                                    <p className="text-muted-foreground">Manage announcements for your students</p>
                                </div>
                            </div>
                            <Button
                                onClick={() => setShowForm(!showForm)}
                                className="flex items-center gap-2 w-full sm:w-auto"
                            >
                                {showForm ? 'Cancel' : (
                                    <>
                                        <Plus className="h-4 w-4" />
                                        Create Notice
                                    </>
                                )}
                            </Button>
                        </div>

                        {showForm && (
                            <Card className="mb-8 border-none shadow-xl animate-in slide-in-from-top duration-300">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Create New Announcement</CardTitle>
                                            <CardDescription>Send an update to all or specific students</CardDescription>
                                        </div>
                                        <div className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-full animate-pulse">
                                            Live Preview Mode
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Title *</label>
                                                <Input
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    placeholder="Importance of Upcoming Exams"
                                                    className="text-lg font-semibold"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Content *</label>
                                                <textarea
                                                    value={content}
                                                    onChange={(e) => setContent(e.target.value)}
                                                    placeholder="Write your announcement here..."
                                                    className="w-full min-h-[150px] p-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-sm font-medium">Target Audience</label>
                                                <div className="flex gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setTargetType('all')}
                                                        className={`flex-1 p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${targetType === 'all'
                                                            ? 'border-primary bg-primary/5 text-primary'
                                                            : 'border-muted hover:border-muted-foreground/30'
                                                            }`}
                                                    >
                                                        <Users className="h-5 w-5" />
                                                        <span className="font-semibold">All Students</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setTargetType('course')}
                                                        className={`flex-1 p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${targetType === 'course'
                                                            ? 'border-primary bg-primary/5 text-primary'
                                                            : 'border-muted hover:border-muted-foreground/30'
                                                            }`}
                                                    >
                                                        <BookOpen className="h-5 w-5" />
                                                        <span className="font-semibold">Specific Courses</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {targetType === 'course' && (
                                                <div className="space-y-3 animate-in fade-in duration-300">
                                                    <label className="text-sm font-medium">Select Courses *</label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {courses.map(course => (
                                                            <button
                                                                key={course._id}
                                                                type="button"
                                                                onClick={() => toggleCourseSelection(course._id)}
                                                                className={`text-left p-3 rounded-lg border transition-all text-sm flex items-center justify-between ${selectedCourses.includes(course._id)
                                                                    ? 'bg-primary/10 border-primary text-primary'
                                                                    : 'bg-card border-muted hover:border-muted-foreground/30'
                                                                    }`}
                                                            >
                                                                <span className="truncate pr-2">{course.title}</span>
                                                                {selectedCourses.includes(course._id) && (
                                                                    <CheckCircle className="h-4 w-4 shrink-0" />
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <Button
                                                type="submit"
                                                disabled={creating}
                                                className="w-full sm:w-auto px-8"
                                            >
                                                {creating ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                        Posting...
                                                    </>
                                                ) : 'Post Announcement'}
                                            </Button>
                                        </form>

                                        {/* LIVE PREVIEW SECTION */}
                                        <div className="hidden lg:block space-y-4">
                                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest px-2">Student View Preview</h3>
                                            <div className="border rounded-2xl p-6 bg-gradient-to-br from-accent/20 to-background shadow-inner min-h-[400px] relative overflow-hidden">
                                                {/* Blurred Decorative Background Elements for Preview */}
                                                <div className="absolute top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-[60px] pointer-events-none" />
                                                <div className="absolute bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />

                                                {(title || content) ? (
                                                    <Card className="group border-none shadow-premium overflow-hidden transition-all saturate-150 bg-card/40 backdrop-blur-xl relative z-10">
                                                        <div className="h-1.5 bg-gradient-to-r from-primary to-primary/40" />
                                                        <CardHeader className="pb-2">
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${targetType === 'all'
                                                                    ? 'bg-blue-100 text-blue-600'
                                                                    : 'bg-purple-100 text-purple-600'
                                                                    }`}>
                                                                    {targetType === 'all' ? 'General' : 'Course Update'}
                                                                </span>
                                                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                                                    <Clock className="h-3.5 w-3.5" />
                                                                    {format(new Date(), 'MMMM dd, yyyy')}
                                                                </span>
                                                            </div>
                                                            <CardTitle className="text-2xl font-bold text-foreground">
                                                                {title || 'Your Title Goes Here'}
                                                            </CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="pt-4">
                                                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-lg min-h-[100px]">
                                                                {content || 'Your announcement content will be displayed here in this style...'}
                                                            </p>

                                                            <div className="mt-8 pt-6 border-t border-muted flex items-center justify-between">
                                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                                        <Users className="h-4 w-4 text-primary" />
                                                                    </div>
                                                                    <span className="text-sm font-bold">Admin Team</span>
                                                                </div>
                                                                <div className="text-primary flex items-center gap-1 text-sm font-black uppercase tracking-tighter cursor-pointer hover:underline">
                                                                    Read Full →
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ) : (
                                                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-40">
                                                        <Megaphone className="h-16 w-16 mb-4" />
                                                        <p className="text-center">Start typing title or content<br />to see preview</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <div className="space-y-6">
                            <h2 className="text-xl font-bold">Previous Announcements</h2>
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : notices.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground bg-accent/5 rounded-2xl border-2 border-dashed">
                                    <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                    <p>No notices have been posted yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6 relative">
                                    <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px] -z-0 pointer-events-none" />
                                    <div className="absolute bottom-40 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-0 pointer-events-none" />

                                    {notices.map(notice => (
                                        <Card key={notice._id} className="group border-none shadow-premium overflow-hidden transition-all hover:translate-y-[-2px] bg-card/30 backdrop-blur-2xl relative z-10 border border-white/5">
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
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(notice._id); }}
                                                    className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </CardHeader>
                                            <CardContent className="pt-4">
                                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-lg line-clamp-3">
                                                    {notice.content}
                                                </p>

                                                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <Users className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <span className="text-sm font-bold truncate">
                                                            {notice.targetType === 'all'
                                                                ? 'All Students'
                                                                : `${Array.isArray(notice.targetCourses) ? notice.targetCourses.length : 0} Courses Targeted`}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => setSelectedNotice(notice)}
                                                        className="text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-sm font-black uppercase tracking-tighter hover:underline"
                                                    >
                                                        Read Full <ChevronRight className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>

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
                                                        <p className="font-black text-sm uppercase tracking-wider">Posted By You</p>
                                                        <p className="text-xs text-muted-foreground">Admin Console</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={() => setSelectedNotice(null)}
                                                    size="lg"
                                                    className="w-full sm:w-auto px-10 rounded-xl"
                                                >
                                                    Close Preview
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

function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}
