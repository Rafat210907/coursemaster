'use client';

import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchCourse } from '../../store/slices/courseSlice';
import { enrollCourse, fetchEnrolledCourses } from '../../store/slices/enrollmentSlice';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { RootState, AppDispatch } from '../../store/store';
import { Course, Review } from '../../../types';
import { Star, Clock, BookOpen, CheckCircle, MessageSquare } from 'lucide-react';
import api from '../../../lib/axios';
import TutorCard from '../../../components/TutorCard';

export default function CourseDetails() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { currentCourse, loading } = useSelector((state: RootState) => state.courses);
  const { user } = useSelector((state: RootState) => state.auth);
  const { enrollments } = useSelector((state: RootState) => state.enrollments);
  const [enrolling, setEnrolling] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const fetchReviews = useCallback(async () => {
    try {
      const response = await api.get(`/reviews/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      dispatch(fetchCourse(id as string));
      fetchReviews();
    }
    if (user) {
      dispatch(fetchEnrolledCourses());
    }
  }, [dispatch, id, fetchReviews, user]);

  const handleEnroll = async () => {
    if (!currentCourse) return;
    setEnrolling(true);
    try {
      await dispatch(enrollCourse(currentCourse._id));
    } finally {
      setEnrolling(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');

    try {
      await api.post('/reviews', { courseId: id, ...newReview });
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      setReviewError('');
      fetchReviews();
    } catch (error: unknown) {
      console.error('Error submitting review:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      setReviewError(axiosError.response?.data?.message || 'Failed to submit review');
    }
  };

  const isEnrolled = currentCourse ? enrollments.some(e => {
    if (!e.course) return false;
    const courseId = typeof e.course === 'object' ? (e.course as Course)._id : e.course;
    return courseId === currentCourse._id;
  }) : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded mb-8"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCourse) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Course Not Found</h1>
          <p className="text-muted-foreground">The course you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  const course: Course = currentCourse;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-muted-foreground mb-4">{course.description}</p>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{course.averageRating?.toFixed(1) || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{course.reviewCount || 0} reviews</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{course.category}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{course.duration} hours</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {course.tags.map((tag) => (
                  <span key={tag} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Syllabus */}
            {course.syllabus && course.syllabus.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Course Syllabus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.syllabus.map((item, index) => (
                      <div key={index} className="border-l-2 border-primary pl-4">
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground text-sm">{item.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Reviews ({reviews.length})
                </CardTitle>
                {user && isEnrolled && !showReviewForm && (
                  <Button variant="outline" onClick={() => {
                    setShowReviewForm(true);
                    setReviewError('');
                  }}>
                    Write a Review
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {showReviewForm && (
                  <form onSubmit={handleReviewSubmit} className="mb-6 p-4 border rounded-lg">
                    <h3 className="font-semibold mb-4">Write a Review</h3>
                    {reviewError && (
                      <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
                        {reviewError}
                      </div>
                    )}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Rating</label>
                      <select
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                        className="border border-input bg-background px-3 py-2 rounded-md"
                      >
                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Stars</option>)}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Comment</label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        placeholder="Share your thoughts about this course..."
                        className="w-full border border-input bg-background px-3 py-2 rounded-md min-h-[100px]"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Submit Review</Button>
                      <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}

                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review._id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="font-semibold text-sm">
                            {typeof review.user === 'object' ? review.user.name : 'Anonymous'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No reviews yet. Be the first to review this course!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Enroll card */}
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold mb-2">${course.price}</div>
                  <div className="text-muted-foreground">One-time payment</div>
                </div>

                {user ? (
                  isEnrolled ? (
                    <Button className="w-full" disabled>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Already Enrolled
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={handleEnroll}
                      disabled={enrolling}
                    >
                      {enrolling ? 'Enrolling...' : 'Enroll Now'}
                    </Button>
                  )
                ) : (
                  <a href="/login">
                    <Button className="w-full">Login to Enroll</Button>
                  </a>
                )}

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Self-paced learning</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructor cards */}
            <div className="space-y-4">
              {(course.instructors || []).map((instructor, index) => (
                typeof instructor === 'object' && (
                  <TutorCard
                    key={instructor._id}
                    name={instructor.name}
                    expertise={instructor.expertise}
                    profileImage={instructor.profileImage}
                    activeCourseCount={Array.isArray(instructor.courses) ? instructor.courses.length : undefined}
                  />
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}