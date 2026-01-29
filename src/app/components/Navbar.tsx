'use client';

import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { RootState, AppDispatch } from '../store/store';
import Link from 'next/link';

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">CourseMaster</Link>
        <div className="flex gap-4">
          {user ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              {user.role === 'admin' && <Link href="/admin/courses">Admin</Link>}
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" prefetch={false}>Login</Link>
              <Link href="/register" prefetch={false}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}