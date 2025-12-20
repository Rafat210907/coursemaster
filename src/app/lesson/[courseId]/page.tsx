'use client';

import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { fetchEnrolledCourses, updateProgress } from '../../store/slices/enrollmentSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { RootState, AppDispatch } from '../../store/store';
import { Lesson, Assignment, Quiz } from '../../../types';
import { Play, CheckCircle, FileText, HelpCircle, ArrowRight, GraduationCap } from 'lucide-react';

import api from '../../../lib/axios';

const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const dispatch = useDispatch<AppDispatch>();
  const { enrollments } = useSelector((state: RootState) => state.enrollments);
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const enrollment = enrollments.find(e => (e.course && typeof e.course === 'object' ? e.course._id : e.course) === courseId);

  const fetchCourseData = useCallback(async () => {
    try {
      const [lessonsRes, assignmentsRes, quizzesRes] = await Promise.all([
        api.get(`/lessons/course/${courseId}`),
        api.get(`/assignments/course/${courseId}`),
        api.get(`/quizzes/course/${courseId}`)
      ]);

      setLessons(lessonsRes.data);
      if (lessonsRes.data.length > 0) {
        setSelectedLesson(lessonsRes.data[0]);
      }
      setAssignments(assignmentsRes.data);
      setQuizzes(quizzesRes.data);
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (user && courseId) {
      dispatch(fetchEnrolledCourses());
      fetchCourseData();
    }
  }, [dispatch, user, courseId, fetchCourseData]);

  const handleLessonComplete = async (lessonId: string) => {
    if (!enrollment) return;

    try {
      await dispatch(updateProgress({ enrollmentId: enrollment._id, lessonId }));
      dispatch(fetchEnrolledCourses()); // Refresh enrollments
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleQuizSubmit = async (quizId: string) => {
    try {
      const response = await api.post('/quizzes/submit', {
        quizId,
        answers: quizAnswers
      });
      setQuizScore(response.data.score);
      setQuizSubmitted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return enrollment?.completedLessons.some(cl => cl.lesson === lessonId) || false;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">Please login to access lessons.</p>
        </div>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Not Enrolled</h1>
          <p className="text-muted-foreground">You are not enrolled in this course.</p>
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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 h-96 bg-muted rounded"></div>
              <div className="lg:col-span-3 h-96 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{typeof enrollment.course === 'object' ? enrollment.course.title : 'Course'}</h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Lesson List Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lessons.map((lesson, index) => (
                    <button
                      key={lesson._id}
                      onClick={() => {
                        setSelectedLesson(lesson);
                        setQuizSubmitted(false);
                        setQuizAnswers([]);
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${selectedLesson?._id === lesson._id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="shrink-0">
                          {isLessonCompleted(lesson._id) ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Play className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {index + 1}. {lesson.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {lesson.duration} min
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Quizzes card */}
            <Card className="mt-4 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group" onClick={() => router.push(`/lesson/${courseId}/quizzes`)}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Course Quizzes</h3>
                    <p className="text-xs text-muted-foreground">{quizzes.length} assessments available</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          </div>

          {/* Lesson Content */}
          <div className="lg:col-span-3">
            {selectedLesson ? (
              <div className="space-y-6">
                {/* Video Player ... (existing code remains) */}
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedLesson.title}</CardTitle>
                    <CardDescription>{selectedLesson.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-black rounded-lg mb-4 overflow-hidden">
                      {selectedLesson.videoUrl.includes('youtube') || selectedLesson.videoUrl.includes('youtu.be') ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeId(selectedLesson.videoUrl)}`}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={selectedLesson.videoUrl}
                          controls
                          className="w-full h-full"
                        />
                      )}
                    </div>

                    {!isLessonCompleted(selectedLesson._id) && (
                      <Button
                        onClick={() => handleLessonComplete(selectedLesson._id)}
                        className="w-full"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Completed
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Assignments */}
                {assignments
                  .filter(assignment => selectedLesson.assignments.includes(assignment._id))
                  .map(assignment => (
                    <Card key={assignment._id}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Assignment: {assignment.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">{assignment.description}</p>
                        {assignment.dueDate && (
                          <p className="text-sm text-muted-foreground mb-4">
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </p>
                        )}
                        <Button variant="outline">Submit Assignment</Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <Card className="mb-6">
                <CardContent className="p-8 text-center">
                  <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a Lesson</h3>
                  <p className="text-muted-foreground">Choose a lesson from the sidebar to start learning or jump straight to a quiz using the &quot;Course Quizzes&quot; button.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}