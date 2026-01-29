'use client';

import { useEffect, useState, use } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { AdminSidebar } from '../../../../components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import {
    Users, Mail, ShieldCheck,
    BookOpen, CheckCircle2, Award, Loader2, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import api from '../../../../lib/axios';
import Image from 'next/image';

interface UserDetail {
    _id: string;
    userId: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string;
    createdAt: string;
    enrollments: Array<{
        _id: string;
        course: {
            _id: string;
            title: string;
            price: number;
            lessons: string[];
        };
        progress: number;
        status: string;
        enrolledAt: string;
    }>;
    quizSubmissions: Array<{
        quizId: string;
        title: string;
        score: number;
        totalQuestions: number;
        submittedAt: string;
    }>;
}

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const { user: currentUser } = useSelector((state: RootState) => state.auth);
    const [userData, setUserData] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await api.get(`/admin/users/${id}`);
                setUserData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user details:', error);
                setLoading(false);
            }
        };

        if (id) fetchUserDetails();
    }, [id]);

    if (currentUser?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                    <p className="text-muted-foreground">Admin access required.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground font-medium tracking-tight">Loading user profile...</p>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <p className="text-xl font-bold mb-4">User Not Found</p>
                <Link href="/admin/users">
                    <button className="flex items-center space-x-2 text-primary hover:underline">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Users</span>
                    </button>
                </Link>
            </div>
        );
    }

    const totalInvestment = userData.enrollments.reduce((sum, e) => sum + (e.course?.price || 0), 0);

    return (
        <div className="min-h-screen bg-background">
            <div className="flex">
                <AdminSidebar />

                {/* Main Content */}
                <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    <Link href="/admin/users">
                        <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-6 group">
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-bold uppercase tracking-widest">Back to Users</span>
                        </button>
                    </Link>

                    {/* Profile Header Card */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        <Card className="lg:col-span-1 bg-card/30 backdrop-blur-2xl border-white/5 overflow-hidden shadow-2xl relative">
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/20 to-purple-600/20" />
                            <CardContent className="pt-12 relative z-10 flex flex-col items-center text-center">
                                <div className="h-24 w-24 rounded-2xl bg-background p-1.5 shadow-2x border border-white/10 mb-4 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <div className="h-full w-full rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center overflow-hidden">
                                        {userData.profileImage ? (
                                            <Image src={userData.profileImage} alt={userData.name} width={96} height={96} className="h-full w-full object-cover" unoptimized />
                                        ) : (
                                            <Users className="h-8 w-8 text-primary" />
                                        )}
                                    </div>
                                </div>
                                <h2 className="text-2xl font-black gradient-text tracking-tighter mb-1">{userData.name}</h2>
                                <p className="text-sm text-muted-foreground flex items-center space-x-1 mb-4">
                                    <Mail className="h-3 w-3" />
                                    <span>{userData.email}</span>
                                </p>
                                <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
                                    <ShieldCheck className="h-3 w-3" />
                                    <span>{userData.role}</span>
                                </div>

                                <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                                    <div className="text-center">
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Joined</p>
                                        <p className="text-xs font-bold">{new Date(userData.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Total Invest</p>
                                        <p className="text-xs font-bold text-emerald-400">${totalInvestment.toLocaleString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="lg:col-span-2 space-y-8">
                            {/* Summary Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <Card className="bg-card/30 backdrop-blur-2xl border-white/5">
                                    <CardContent className="p-6 flex items-center space-x-4">
                                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                                            <BookOpen className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black tracking-tight">{userData.enrollments.length}</p>
                                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Courses</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-card/30 backdrop-blur-2xl border-white/5">
                                    <CardContent className="p-6 flex items-center space-x-4">
                                        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                                            <CheckCircle2 className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black tracking-tight">{userData.quizSubmissions.length}</p>
                                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Quizzes</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-card/30 backdrop-blur-2xl border-white/5">
                                    <CardContent className="p-6 flex items-center space-x-4">
                                        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
                                            <Award className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black tracking-tight">
                                                {Math.round(userData.enrollments.reduce((sum, e) => sum + e.progress, 0) / (userData.enrollments.length || 1))}%
                                            </p>
                                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Avg Progress</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Enrolled Courses */}
                            <Card className="bg-card/30 backdrop-blur-2xl border-white/5 shadow-2xl">
                                <CardHeader>
                                    <CardTitle className="text-lg font-black tracking-widest uppercase flex items-center space-x-2">
                                        <BookOpen className="h-5 w-5 text-primary" />
                                        <span>Course Progress</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {userData.enrollments.length === 0 ? (
                                        <p className="text-center py-8 text-muted-foreground">No courses enrolled yet.</p>
                                    ) : (
                                        userData.enrollments.map((e) => (
                                            <div key={e._id} className="p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/30 transition-all">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-bold tracking-tight">{e.course?.title || 'Unknown Course'}</h4>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${e.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                        e.status === 'completed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                            'bg-white/5 text-muted-foreground border-white/10'
                                                        }`}>
                                                        {e.status}
                                                    </span>
                                                </div>
                                                <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden mb-2">
                                                    <div
                                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-1000"
                                                        style={{ width: `${e.progress}%` }}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                    <span>{e.progress}% Complete</span>
                                                    <span>{new Date(e.enrolledAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>

                            {/* Quiz Results */}
                            <Card className="bg-card/30 backdrop-blur-2xl border-white/5 shadow-2xl">
                                <CardHeader>
                                    <CardTitle className="text-lg font-black tracking-widest uppercase flex items-center space-x-2">
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                        <span>Quiz Submissions</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {userData.quizSubmissions.length === 0 ? (
                                        <p className="text-center py-8 text-muted-foreground">No quizzes taken yet.</p>
                                    ) : (
                                        userData.quizSubmissions.map((s) => {
                                            const percent = Math.round((s.score / s.totalQuestions) * 100);
                                            return (
                                                <div key={s.quizId} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                                    <div>
                                                        <h4 className="font-bold tracking-tight mb-1">{s.title}</h4>
                                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                                            {new Date(s.submittedAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        <div className="text-right">
                                                            <p className="text-sm font-black tracking-tight">{s.score} / {s.totalQuestions}</p>
                                                            <p className={`text-[10px] font-black uppercase tracking-widest ${percent >= 70 ? 'text-emerald-400' :
                                                                percent >= 50 ? 'text-amber-400' : 'text-rose-400'
                                                                }`}>
                                                                {percent}%
                                                            </p>
                                                        </div>
                                                        <div className="h-10 w-10 rounded-xl border border-white/10 flex items-center justify-center bg-white/5">
                                                            <Award className={`h-5 w-5 ${percent >= 70 ? 'text-emerald-400' :
                                                                percent >= 50 ? 'text-amber-400' : 'text-rose-400'
                                                                }`} />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
