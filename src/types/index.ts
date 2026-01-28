export interface User {
  _id: string;
  userId?: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  enrolledCourses: string[];
  profileImage?: string;
  createdAt: string;
}

export interface Tutor {
  _id: string;
  name: string;
  bio?: string;
  expertise: string[];
  experience: number;
  profileImage?: string;
  totalStudents: number;
  courses: (string | Course)[];
  createdAt: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  syllabus: { title: string; content: string }[];
  price: number;
  duration: number;
  tags: string[];
  category: string;
  instructors: (string | Tutor)[];
  lessons: string[];
  batches: string[];
  createdAt: string;
  averageRating?: number;
  reviewCount?: number;
}

export interface Enrollment {
  _id: string;
  student: string | User;
  course: string | Course;
  batch?: string | Batch;
  progress: number;
  completedLessons: { lesson: string; completedAt: string }[];
  enrolledAt: string;
  status: 'active' | 'completed' | 'dropped' | 'pending' | 'approved' | 'rejected';
}

export interface Lesson {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
  course: string;
  assignments: string[];
  quizzes: string[];
}

export interface Quiz {
  _id: string;
  title: string;
  lesson?: string;
  course: string;
  questions: {
    question: string;
    options: string[];
    type: 'single' | 'multiple';
    correctAnswer?: number;
    correctAnswers: number[];
  }[];
  submissions: {
    student: string | any;
    answers: (number | number[])[];
    score: number;
    submittedAt: string;
  }[];
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  lesson: string | Lesson;
  dueDate?: string;
  status?: 'pending' | 'submitted' | 'graded';
  course?: string | Course;
  student?: string | User;
  submission?: string;
  submittedAt?: string;
  grade?: number;
  feedback?: string;
  gradedBy?: string | User;
  gradedAt?: string;
  attachments?: string[];
  submissions?: {
    student: string | User;
    submission: string;
    submittedAt: string;
    grade?: number;
    feedback?: string;
  }[];
}

export interface Batch {
  _id: string;
  name: string;
  course: string;
  startDate: string;
  endDate: string;
  maxStudents?: number;
  enrolledStudents: string[];
}

export interface Review {
  _id: string;
  course: string;
  user: string | { name: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Notice {
  _id: string;
  title: string;
  content: string;
  targetType: 'all' | 'course';
  targetCourses: string[] | Course[];
  createdBy: string | User;
  createdAt: string;
}

export interface Notification {
  _id: string;
  recipient: string;
  message: string;
  type: 'notice' | 'assignment' | 'grade' | 'system';
  referenceId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Analytics {
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  courseStats: { course: string; enrollments: number; revenue: number }[];
  monthlyStats: { month: string; enrollments: number; revenue: number }[];
  coursePopularity?: { title: string; count: number }[];
  topSearchedCourses?: { title: string; searchCount: number }[];
  topQuizCompleters?: { name: string; completedQuizzes: number }[];
}