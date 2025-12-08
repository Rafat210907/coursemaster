'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEnrolledCourses } from '../store/slices/enrollmentSlice';
import Link from 'next/link';

export default function Dashboard() {
  const dispatch = useDispatch<any>();
  const { enrollments, loading } = useSelector((state: any) => state.enrollments);
  const { user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchEnrolledCourses());
    }
  }, [dispatch, user]);

  if (!user) return <p>Please login</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.map((enrollment: any) => (
          <div key={enrollment._id} className="border rounded-lg p-4 shadow">
            <h2 className="text-xl font-semibold mb-2">{enrollment.course.title}</h2>
            <p className="text-gray-600 mb-2">Progress: {enrollment.progress}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${enrollment.progress}%` }}
              ></div>
            </div>
            <Link href={`/lesson/${enrollment.course._id}`} className="bg-blue-500 text-white px-4 py-2 rounded">
              Continue Learning
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}