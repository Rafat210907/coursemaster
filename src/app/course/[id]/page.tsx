'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchCourse } from '../../store/slices/courseSlice';
import { enrollCourse } from '../../store/slices/enrollmentSlice';
import Link from 'next/link';

export default function CourseDetail() {
  const { id } = useParams();
  const dispatch = useDispatch<any>();
  const { currentCourse, loading } = useSelector((state: any) => state.courses);
  const { user } = useSelector((state: any) => state.auth);
  const [enrolled, setEnrolled] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchCourse(id as string));
    }
  }, [dispatch, id]);

  const handleEnroll = () => {
    if (currentCourse) {
      setShowPayment(true);
    }
  };

  const handlePayment = () => {
    // Simulate payment
    dispatch(enrollCourse(currentCourse._id));
    setEnrolled(true);
    setShowPayment(false);
  };

  if (loading) return <p>Loading...</p>;
  if (!currentCourse) return <p>Course not found</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{currentCourse.title}</h1>
      <p className="text-gray-600 mb-4">{currentCourse.description}</p>
      <p className="text-sm text-gray-500 mb-2">Instructor: {currentCourse.instructor}</p>
      <p className="text-lg font-bold mb-4">${currentCourse.price}</p>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Tags</h2>
        <div className="flex gap-2">
          {currentCourse.tags.map((tag: string) => (
            <span key={tag} className="bg-gray-200 px-2 py-1 rounded">{tag}</span>
          ))}
        </div>
      </div>
      {user ? (
        enrolled ? (
          <p className="text-green-500">Enrolled successfully!</p>
        ) : showPayment ? (
          <div className="border p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Payment Simulation</h3>
            <p>Price: ${currentCourse.price}</p>
            <button onClick={handlePayment} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
              Pay Now
            </button>
          </div>
        ) : (
          <button onClick={handleEnroll} className="bg-green-500 text-white px-4 py-2 rounded">
            Enroll Now
          </button>
        )
      ) : (
        <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded">
          Login to Enroll
        </Link>
      )}
    </div>
  );
}