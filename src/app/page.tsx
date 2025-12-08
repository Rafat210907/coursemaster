'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from './store/slices/courseSlice';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Course } from '../types';
import { RootState, AppDispatch } from './store/store';
import { Search, Filter } from 'lucide-react';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading, error, totalPages, currentPage } = useSelector((state: RootState) => state.courses);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    dispatch(fetchCourses({ page: 1, search, category }));
  }, [dispatch, search, category]);

  const handlePageChange = (page: number) => {
    dispatch(fetchCourses({ page, search, category }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Welcome to CourseMaster</h1>
          <p className="text-xl text-muted-foreground mb-8">Discover and master new skills with our comprehensive courses</p>
        </motion.div>

        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-input bg-background px-3 py-2 rounded-md text-sm"
            >
              <option value="">All Categories</option>
              <option value="programming">Programming</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
              <option value="marketing">Marketing</option>
              <option value="data-science">Data Science</option>
              <option value="photography">Photography</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton height={24} />
                  <Skeleton height={16} />
                </CardHeader>
                <CardContent>
                  <Skeleton count={3} />
                </CardContent>
                <CardFooter>
                  <Skeleton height={36} width={100} />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {courses.map((course: Course, index: number) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Instructor: {course.instructor}</p>
                      <p className="text-sm text-muted-foreground">Duration: {course.duration} hours</p>
                      <div className="flex flex-wrap gap-1">
                        {course.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <span className="text-2xl font-bold">${course.price}</span>
                    <Link href={`/course/${course._id}`}>
                      <Button>View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && !error && totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
