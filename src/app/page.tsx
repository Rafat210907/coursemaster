'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from './store/slices/courseSlice';
import Link from 'next/link';

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  instructor: string;
  tags: string[];
}

export default function Home() {
  const dispatch = useDispatch<any>();
  const { courses, loading, error, totalPages, currentPage } = useSelector((state: any) => state.courses);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    dispatch(fetchCourses({ page: 1, search, category }));
  }, [dispatch, search, category]);

  const handlePageChange = (page: number) => {
    dispatch(fetchCourses({ page, search, category }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">CourseMaster</h1>

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          <option value="programming">Programming</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: Course) => (
            <div key={course._id} className="border rounded-lg p-4 shadow">
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-2">{course.description}</p>
              <p className="text-sm text-gray-500 mb-2">Instructor: {course.instructor}</p>
              <p className="text-lg font-bold mb-4">${course.price}</p>
              <Link href={`/course/${course._id}`} className="bg-blue-500 text-white px-4 py-2 rounded">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 border rounded ${page === currentPage ? 'bg-blue-500 text-white' : ''}`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
