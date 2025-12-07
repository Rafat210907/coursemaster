'use client';

import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { logout } from '../app/store/slices/authSlice';

export default function Header() {
  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch<any>();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">CourseMaster</Link>
        <nav className="flex gap-4">
          <Link href="/">Home</Link>
          {user ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              {user.role === 'admin' && (
                <>
                  <Link href="/admin/courses">Admin Courses</Link>
                  <Link href="/admin/analytics">Analytics</Link>
                </>
              )}
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}