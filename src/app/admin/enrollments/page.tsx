'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEnrollments, updateEnrollmentStatus, cleanupOrphanedEnrollments } from '../../store/slices/adminSlice';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { RootState, AppDispatch } from '../../store/store';
import { User, Course } from '../../../types';
import { UserCheck, UserX, Clock, CheckCircle, Users } from 'lucide-react';

export default function AdminEnrollments() {
  const dispatch = useDispatch<AppDispatch>();
  const { enrollments, loading, error } = useSelector((state: RootState) => state.admin);
  const { user } = useSelector((state: RootState) => state.auth);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'dropped'>('all');

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(fetchEnrollments());
    }
  }, [dispatch, user]);

  const handleStatusUpdate = async (enrollmentId: string, status: 'approved' | 'rejected') => {
    try {
      await dispatch(updateEnrollmentStatus({ id: enrollmentId, status }));
    } catch (error) {
      console.error('Error updating enrollment status:', error);
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    if (filter === 'all') return true;
    return enrollment.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'rejected':
        return <UserX className="h-4 w-4 text-red-500" />;
      case 'active':
        return <UserCheck className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'dropped':
        return <UserX className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'dropped':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Enrollment Management</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(cleanupOrphanedEnrollments())}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Cleanup Orphaned
            </Button>
            {(['all', 'pending', 'approved', 'rejected', 'active', 'completed', 'dropped'] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrollments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {enrollments.filter(e => e.status === 'pending').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {enrollments.filter(e => e.status === 'approved').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <UserX className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {enrollments.filter(e => e.status === 'rejected').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-4 w-1/2"></div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-muted rounded w-20"></div>
                      <div className="h-8 bg-muted rounded w-20"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEnrollments.map((enrollment) => (
              <Card key={enrollment._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {(enrollment.student as User)?.name || 'Unknown Student'}
                        </h3>
                        <p className="text-muted-foreground">
                          {(enrollment.student as User)?.email || 'No email'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Course: {(enrollment.course as Course)?.title || 'Unknown Course'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)}`}>
                          {getStatusIcon(enrollment.status)}
                          {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </p>
                      </div>

                      {enrollment.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(enrollment._id, 'approved')}
                            disabled={loading}
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusUpdate(enrollment._id, 'rejected')}
                            disabled={loading}
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {enrollment.status === 'completed' && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress: {enrollment.progress || 0}%</span>
                        <span>Lessons completed: {enrollment.completedLessons?.length || 0}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {filteredEnrollments.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No enrollments found</h3>
                  <p className="text-muted-foreground">
                    {filter === 'all'
                      ? 'There are no enrollments yet.'
                      : `No enrollments with status "${filter}".`
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}