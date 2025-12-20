'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics } from '../store/slices/adminSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { RootState, AppDispatch } from '../store/store';
import { Users, BookOpen, UserCheck, TrendingUp, BarChart3, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

import { AdminSidebar } from '../../components/AdminSidebar';

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { analytics, loading, error } = useSelector((state: RootState) => state.admin);
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('analytics');

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(fetchAnalytics());
    }
  }, [dispatch, user]);

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">Admin access required.</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3, active: true },
    { id: 'courses', label: 'Admin Courses', icon: BookOpen, href: '/admin/courses' },
    { id: 'tutors', label: 'Manage Tutors', icon: Users, href: '/admin/tutors' },
    { id: 'quiz', label: 'Create Quiz', icon: Plus, href: '/admin/quiz' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor your platform&apos;s performance</p>
          </div>

          {loading && (
            <div className="animate-pulse relative">
              <div className="h-8 bg-muted rounded mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80 bg-muted rounded"></div>
                <div className="h-80 bg-muted rounded"></div>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {!loading && !error && analytics && (
            <div className="relative">
              {/* Blurred Decorative Background Elements */}
              <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px] -z-0 pointer-events-none" />
              <div className="absolute bottom-40 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-0 pointer-events-none" />

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10">
                <Card className="group border-none shadow-premium overflow-hidden transition-all hover:translate-y-[-2px] bg-card/30 backdrop-blur-2xl border border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.totalStudents}</div>
                  </CardContent>
                </Card>

                <Card className="group border-none shadow-premium overflow-hidden transition-all hover:translate-y-[-2px] bg-card/30 backdrop-blur-2xl border border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.totalCourses}</div>
                  </CardContent>
                </Card>

                <Card className="group border-none shadow-premium overflow-hidden transition-all hover:translate-y-[-2px] bg-card/30 backdrop-blur-2xl border border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.totalEnrollments}</div>
                  </CardContent>
                </Card>

                <Card className="group border-none shadow-premium overflow-hidden transition-all hover:translate-y-[-2px] bg-card/30 backdrop-blur-2xl border border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${analytics.totalRevenue}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
                <Card className="border-none shadow-premium bg-card/30 backdrop-blur-2xl border border-white/5">
                  <CardHeader>
                    <CardTitle>Course Popularity</CardTitle>
                    <CardDescription>Most enrolled courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.coursePopularity || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="title" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-premium bg-card/30 backdrop-blur-2xl border border-white/5">
                  <CardHeader>
                    <CardTitle>Monthly Revenue</CardTitle>
                    <CardDescription>Revenue over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analytics.monthlyStats || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}