'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEnrolledCourses } from '../store/slices/enrollmentSlice';
import Link from 'next/link';
import DashboardSidebar from '../../components/DashboardSidebar';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const dispatch = useDispatch<any>();
  const { enrollments, loading } = useSelector((state: any) => state.enrollments);
  const { user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchEnrolledCourses());
    }
  }, [dispatch, user]);

  if (!user) return <p className="text-white text-center mt-20">Please login</p>;
  if (loading) return <p className="text-white text-center mt-20">Loading...</p>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <DashboardSidebar />

      <main className="flex-1 ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user.name}! 👋</h1>
            <p className="text-gray-400">Track your learning progress and continue where you left off.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6"
            >
              <p className="text-gray-400 text-sm">Courses Enrolled</p>
              <p className="text-3xl font-bold text-white mt-2">{enrollments.length}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6"
            >
              <p className="text-gray-400 text-sm">In Progress</p>
              <p className="text-3xl font-bold text-white mt-2">{enrollments.filter((e: any) => e.progress < 100).length}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6"
            >
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-3xl font-bold text-white mt-2">{enrollments.filter((e: any) => e.progress === 100).length}</p>
            </motion.div>
          </div>

          {/* Enrolled Courses */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Your Courses</h2>
            {enrollments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((enrollment: any, idx: number) => (
                  <motion.div
                    key={enrollment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gradient-to-br from-slate-800/80 to-purple-900/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 hover:border-cyan-500/50 transition"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4">{enrollment.course.title}</h3>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-cyan-400">{enrollment.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${enrollment.progress}%` }}
                          transition={{ delay: 0.5, duration: 1 }}
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full"
                        ></motion.div>
                      </div>
                    </div>

                    <Link
                      href={`/lesson/${enrollment.course._id}`}
                      className="mt-6 w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2 rounded-lg inline-block text-center transition"
                    >
                      Continue Learning →
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-slate-800/80 to-purple-900/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-12 text-center">
                <p className="text-gray-400 mb-4">No courses enrolled yet.</p>
                <Link
                  href="/"
                  className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition"
                >
                  Explore Courses
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}