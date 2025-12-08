'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../app/store/slices/authSlice';
import { motion } from 'framer-motion';

export default function VisionNavbar() {
  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch<any>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const menuVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-md border-b border-purple-500/20 z-50 h-16 flex items-center px-6">
        <div className="flex justify-between items-center w-full">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            CourseMaster
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-white text-2xl"
          >
            ☰
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/" className="text-gray-300 hover:text-white transition">
              Home
            </Link>

            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
                  Dashboard
                </Link>

                <div className="relative group">
                  <button className="text-gray-300 hover:text-white transition flex items-center gap-2">
                    🔔 <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
                  </button>
                </div>

                <Link href="/profile" className="text-gray-300 hover:text-white transition">
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-300 hover:text-white transition">
                  Sign In
                </Link>
                <Link href="/register" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      {user?.role === 'admin' && (
        <motion.div
          initial={{ x: -250, opacity: 0 }}
          animate={{ x: sidebarOpen ? 0 : -250, opacity: sidebarOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="fixed left-0 top-16 bottom-0 w-64 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 border-r border-purple-500/20 p-6 z-40 md:hidden"
        >
          <motion.div variants={menuVariants} initial="hidden" animate="visible" className="space-y-4">
            <motion.div variants={itemVariants}>
              <Link href="/dashboard" className="block text-gray-300 hover:text-white transition p-2">
                Dashboard
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link href="/admin/courses" className="block text-gray-400 hover:text-white transition p-2 pl-4">
                └─ Courses
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link href="/admin/analytics" className="block text-gray-400 hover:text-white transition p-2 pl-4">
                └─ Analytics
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link href="/admin/quiz" className="block text-gray-400 hover:text-white transition p-2 pl-4">
                └─ Create Quiz
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* Main Content Offset */}
      <div className="pt-16"></div>
    </>
  );
}