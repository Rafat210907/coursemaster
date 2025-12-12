'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { RootState, AppDispatch } from '../../store/store';
import { BookOpen, HelpCircle, Clock, Award, ArrowRight } from 'lucide-react';

interface Quiz {
  _id: string;
  title: string;
  lessonId: string;
  questions: any[];
  createdAt: string;
}

export default function DashboardQuizzes() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch user's available quizzes
    // For now, show empty state
    setLoading(false);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">Please login to view your quizzes.</p>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-card border-r min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-6">Dashboard</h2>
            <nav className="space-y-2">
              <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                <BookOpen className="h-5 w-5" />
                My Courses
              </Link>
              <Link href="/dashboard/quizzes" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-primary-foreground">
                <HelpCircle className="h-5 w-5" />
                Quizzes
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">My Quizzes</h1>
              <p className="text-muted-foreground">Test your knowledge and track your progress</p>
            </div>

            <Card className="text-center py-12">
              <CardContent>
                <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No quizzes available</h3>
                <p className="text-muted-foreground mb-4">Complete course lessons to unlock quizzes.</p>
                <Link href="/dashboard">
                  <Button>View My Courses</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
}