'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics } from '../../store/slices/adminSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { RootState, AppDispatch } from '../../store/store';
import { Users, BookOpen, UserCheck, TrendingUp, Award, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
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
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Error Loading Analytics</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">No Analytics Data</h1>
          <p className="text-muted-foreground">Analytics data is not available.</p>
        </div>
      </div>
    );
  }

  const monthlyData = analytics.monthlyStats?.map(m => ({
    month: m.month,
    enrollments: m.enrollments
  })) || [];

  const coursePopularityData = analytics.coursePopularity?.slice(0, 5).map(c => ({
    name: c.title.length > 20 ? c.title.substring(0, 20) + '...' : c.title,
    enrollments: c.count
  })) || [];

  const quizCompletersData = analytics.topQuizCompleters?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="relative">
          {/* Blurred Decorative Background Elements */}
          <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px] -z-0 pointer-events-none" />
          <div className="absolute bottom-40 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-0 pointer-events-none" />

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10">
            <Card className="group border-none shadow-premium overflow-hidden transition-all hover:translate-y-[-2px] bg-card/30 backdrop-blur-2xl border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl font-bold">{analytics.totalStudents || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Registered users
                </p>
              </CardContent>
            </Card>

            <Card className="group border-none shadow-premium overflow-hidden transition-all hover:translate-y-[-2px] bg-card/30 backdrop-blur-2xl border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl font-bold">{analytics.totalCourses || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Available courses
                </p>
              </CardContent>
            </Card>

            <Card className="group border-none shadow-premium overflow-hidden transition-all hover:translate-y-[-2px] bg-card/30 backdrop-blur-2xl border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl font-bold">{analytics.totalEnrollments || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Student enrollments
                </p>
              </CardContent>
            </Card>

            <Card className="group border-none shadow-premium overflow-hidden transition-all hover:translate-y-[-2px] bg-card/30 backdrop-blur-2xl border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium">Avg. Completion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl font-bold">
                  {analytics.totalEnrollments && analytics.totalStudents
                    ? Math.round((analytics.totalEnrollments / analytics.totalStudents) * 100)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Enrollment rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 relative z-10">
            {/* Monthly Enrollments Chart */}
            <Card className="border-none shadow-premium bg-card/30 backdrop-blur-2xl border border-white/5">
              <CardHeader>
                <CardTitle>Monthly Enrollments</CardTitle>
                <CardDescription>Enrollment trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="enrollments"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ fill: '#8884d8' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Course Popularity Chart */}
            <Card className="border-none shadow-premium bg-card/30 backdrop-blur-2xl border border-white/5">
              <CardHeader>
                <CardTitle>Top Courses</CardTitle>
                <CardDescription>Most popular courses by enrollment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={coursePopularityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="enrollments" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Additional Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
            {/* Top Quiz Completers */}
            <Card className="border-none shadow-premium bg-card/30 backdrop-blur-2xl border border-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Top Quiz Performers
                </CardTitle>
                <CardDescription>Students with highest quiz scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quizCompletersData.length > 0 ? (
                    quizCompletersData.map((student, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <span className="font-medium">{student.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {student.completedQuizzes} quizzes completed
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No quiz data available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Searched Courses */}
            <Card className="border-none shadow-premium bg-card/30 backdrop-blur-2xl border border-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Most Searched Courses
                </CardTitle>
                <CardDescription>Popular course searches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.topSearchedCourses && analytics.topSearchedCourses.length > 0 ? (
                    analytics.topSearchedCourses.slice(0, 5).map((course, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <span className="font-medium line-clamp-1">{course.title}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {course.searchCount} searches
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No search data available</p>
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