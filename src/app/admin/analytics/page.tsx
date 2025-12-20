'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics } from '../../store/slices/adminSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { RootState, AppDispatch } from '../../store/store';
import { Users, BookOpen, UserCheck, TrendingUp, Award, Search, DollarSign } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { AdminSidebar } from '../../../components/AdminSidebar';

export default function AdminAnalytics() {
  const dispatch = useDispatch<AppDispatch>();
  const { analytics, loading, error } = useSelector((state: RootState) => state.admin);
  const { user } = useSelector((state: RootState) => state.auth);

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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border p-3 rounded-xl shadow-xl">
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-sm text-primary">
            {payload[0].name}: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-8 w-1/4"></div>
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
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Error Loading Analytics</h1>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-background flex">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">No Analytics Data</h1>
            <p className="text-muted-foreground">Analytics data is not available.</p>
          </div>
        </div>
      </div>
    );
  }

  const monthlyData = analytics.monthlyStats?.map(m => ({
    month: m.month,
    enrollments: m.enrollments,
    revenue: m.revenue
  })) || [];

  const coursePopularityData = analytics.coursePopularity?.slice(0, 5).map(c => ({
    name: c.title.length > 20 ? c.title.substring(0, 20) + '...' : c.title,
    enrollments: c.count
  })) || [];

  const quizCompletersData = analytics.topQuizCompleters?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-8 overflow-x-hidden relative">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Platform performance overview</p>
          </div>
          <div className="text-sm px-3 py-1 bg-muted rounded-full text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="relative">
          {/* Blurred Decorative Background Elements */}
          <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px] -z-0 pointer-events-none" />
          <div className="absolute bottom-40 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-0 pointer-events-none" />

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10">
            <Card className="group border-none shadow-premium overflow-hidden transition-all duration-300 hover:translate-y-[-4px] bg-card/40 backdrop-blur-2xl border border-white/5 hover:bg-card/60">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  ${analytics.totalRevenue?.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Lifetime earnings
                </p>
              </CardContent>
            </Card>

            <Card className="group border-none shadow-premium overflow-hidden transition-all duration-300 hover:translate-y-[-4px] bg-card/40 backdrop-blur-2xl border border-white/5 hover:bg-card/60">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl font-bold">{analytics.totalStudents || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Registered students
                </p>
              </CardContent>
            </Card>

            <Card className="group border-none shadow-premium overflow-hidden transition-all duration-300 hover:translate-y-[-4px] bg-card/40 backdrop-blur-2xl border border-white/5 hover:bg-card/60">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
                <UserCheck className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl font-bold">{analytics.totalEnrollments || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Course subscriptions
                </p>
              </CardContent>
            </Card>

            <Card className="group border-none shadow-premium overflow-hidden transition-all duration-300 hover:translate-y-[-4px] bg-card/40 backdrop-blur-2xl border border-white/5 hover:bg-card/60">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
                <TrendingUp className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl font-bold">
                  {analytics.totalEnrollments && analytics.totalStudents
                    ? Math.round((analytics.totalEnrollments / analytics.totalStudents) * 100)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Engagement rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 relative z-10">
            {/* Revenue Trend */}
            <Card className="border-none shadow-premium bg-card/30 backdrop-blur-2xl border border-white/5 hover:bg-card/40 transition-colors">
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly earnings overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      name="Revenue"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Enrollment Trend */}
            <Card className="border-none shadow-premium bg-card/30 backdrop-blur-2xl border border-white/5 hover:bg-card/40 transition-colors">
              <CardHeader>
                <CardTitle>Enrollment Growth</CardTitle>
                <CardDescription>New students per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="enrollments"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      name="Enrollments"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
            {/* Top Courses Bar Chart (Span 2 cols) */}
            <Card className="lg:col-span-2 border-none shadow-premium bg-card/30 backdrop-blur-2xl border border-white/5 hover:bg-card/40 transition-colors">
              <CardHeader>
                <CardTitle>Most Popular Courses</CardTitle>
                <CardDescription>By total student enrollments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={coursePopularityData} layout="vertical" margin={{ left: 0, right: 30, top: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" horizontal={true} vertical={false} />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={150}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                      content={<CustomTooltip />}
                    />
                    <Bar
                      dataKey="enrollments"
                      fill="hsl(var(--primary))"
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                      name="Students"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Quiz Performers - List */}
            <Card className="border-none shadow-premium bg-card/30 backdrop-blur-2xl border border-white/5 hover:bg-card/40 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Top Learners
                </CardTitle>
                <CardDescription>Highest engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {quizCompletersData.length > 0 ? (
                    quizCompletersData.map((student, index) => (
                      <div key={index} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg
                            ${index === 0 ? 'bg-gradient-to-br from-yellow-300 to-amber-500 text-white' :
                              index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-white' :
                                index === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-500 text-white' :
                                  'bg-muted text-muted-foreground'}
                          `}>
                            {index + 1}
                          </div>
                          <span className="font-medium group-hover:text-primary transition-colors">{student.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-sm font-bold text-foreground">
                            {student.completedQuizzes}
                          </span>
                          <span className="text-xs text-muted-foreground">quizzes</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <Award className="h-8 w-8 mb-2 opacity-20" />
                      <p>No quiz data</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Statistics */}
          <div className="grid grid-cols-1 mt-6 relative z-10">
            <Card className="border-none shadow-premium bg-card/30 backdrop-blur-2xl border border-white/5 hover:bg-card/40 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-500" />
                  Search Insights
                </CardTitle>
                <CardDescription>What students are looking for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analytics?.topSearchedCourses && analytics.topSearchedCourses.length > 0 ? (
                    analytics.topSearchedCourses.slice(0, 6).map((course, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-white/5">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className="text-sm font-medium truncate">{course.title}</span>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-md whitespace-nowrap">
                          {course.searchCount} hits
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground col-span-full text-center py-4">No search data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}