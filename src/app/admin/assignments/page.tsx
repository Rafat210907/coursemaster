'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssignments, gradeAssignment } from '../../store/slices/adminSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { RootState, AppDispatch } from '../../store/store';
import { Assignment } from '../../../types';
import { FileText, User, BookOpen, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function AdminAssignments() {
  const dispatch = useDispatch<AppDispatch>();
  const { assignments, loading, error } = useSelector((state: RootState) => state.admin);
  const { user } = useSelector((state: RootState) => state.auth);
  const [gradingAssignment, setGradingAssignment] = useState<string | null>(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(fetchAssignments());
    }
  }, [dispatch, user]);

  const handleGradeSubmit = async (assignmentId: string, studentId: string) => {
    if (!grade || !feedback) {
      alert('Please provide both grade and feedback');
      return;
    }

    try {
      await dispatch(gradeAssignment({
        assignmentId,
        studentId,
        grade: Number(grade),
        feedback
      }));
      setGradingAssignment(null);
      setGrade('');
      setFeedback('');
    } catch (error) {
      console.error('Error grading assignment:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'graded':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
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
          <h1 className="text-3xl font-bold">Assignment Grading</h1>
          <div className="text-sm text-muted-foreground">
            {assignments.filter(a => a.status === 'submitted').length} pending reviews
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-4 w-1/2"></div>
                    <div className="h-20 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {assignments.map((assignment) => (
              <Card key={assignment._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                        <CardDescription>
                          {(assignment.lesson as Lesson)?.title} • {(assignment.course as Course)?.title}
                        </CardDescription>
                      </div>
                    </div>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status || 'pending')}`}>
                      {getStatusIcon(assignment.status || 'pending')}
                      {(assignment.status || 'pending').charAt(0).toUpperCase() + (assignment.status || 'pending').slice(1)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Student Information
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>Name:</strong> {(assignment.student as User)?.name || 'Unknown'}</p>
                        <p><strong>Email:</strong> {(assignment.student as User)?.email || 'No email'}</p>
                        <p><strong>Submitted:</strong> {new Date(assignment.submittedAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Assignment Details
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>Course:</strong> {assignment.course?.title || 'Unknown'}</p>
                        <p><strong>Lesson:</strong> {assignment.lesson?.title || 'Unknown'}</p>
                        <p><strong>Due Date:</strong> {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Submission</h4>
                    <div className="bg-muted/50 p-4 rounded-md">
                      <p className="text-sm whitespace-pre-wrap">{assignment.submission}</p>
                      {assignment.attachments && assignment.attachments.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-2">Attachments:</p>
                          <div className="flex gap-2 flex-wrap">
                            {assignment.attachments?.map((attachment: string, index: number) => (
                              <a
                                key={index}
                                href={attachment}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs hover:bg-primary/20 transition-colors"
                              >
                                <FileText className="h-3 w-3" />
                                {attachment.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {assignment.status === 'graded' && assignment.grade && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                      <h4 className="font-medium text-green-800 mb-2">Grading Result</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Grade:</strong> {assignment.grade}/100</p>
                        <p><strong>Feedback:</strong></p>
                        <p className="text-green-700 whitespace-pre-wrap">{assignment.feedback}</p>
                        <p><strong>Graded by:</strong> {(assignment.gradedBy as User)?.name || 'Unknown'}</p>
                        <p><strong>Graded on:</strong> {new Date(assignment.gradedAt!).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}

                  {assignment.status === 'submitted' && gradingAssignment !== assignment._id && (
                    <div className="mt-6">
                      <Button
                        onClick={() => setGradingAssignment(assignment._id)}
                        className="w-full sm:w-auto"
                      >
                        Grade Assignment
                      </Button>
                    </div>
                  )}

                  {gradingAssignment === assignment._id && (
                    <div className="mt-6 p-4 border rounded-md bg-muted/20">
                      <h4 className="font-medium mb-4">Grade Assignment</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Grade (0-100)</label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            placeholder="Enter grade"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Feedback</label>
                          <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="w-full border border-input bg-background px-3 py-2 rounded-md min-h-[100px]"
                            placeholder="Provide detailed feedback..."
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleGradeSubmit(assignment._id, assignment.student._id)}
                            disabled={loading}
                          >
                            Submit Grade
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setGradingAssignment(null);
                              setGrade('');
                              setFeedback('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {assignments.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No assignments found</h3>
                  <p className="text-muted-foreground">
                    There are no assignments to grade at this time.
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