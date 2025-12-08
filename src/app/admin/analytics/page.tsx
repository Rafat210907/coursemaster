'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

interface Analytics {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  monthlyEnrollments: { _id: number; count: number }[];
  coursePopularity: { title: string; count: number }[];
  topQuizCompleters: { name: string; totalScore: number }[];
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics');
        setAnalytics(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };
    fetchAnalytics();
  }, []);

  if (!analytics) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Users</h2>
          <p className="text-3xl font-bold">{analytics.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Courses</h2>
          <p className="text-3xl font-bold">{analytics.totalCourses}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Enrollments</h2>
          <p className="text-3xl font-bold">{analytics.totalEnrollments}</p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Monthly Enrollments</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <BarChart width={600} height={300} data={analytics.monthlyEnrollments.map(m => ({ month: `Month ${m._id}`, count: m.count }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Top Courses</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <PieChart width={400} height={400}>
            <Pie data={analytics.coursePopularity} dataKey="count" nameKey="title" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label />
            <Tooltip />
          </PieChart>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Top Quiz Completers</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <BarChart width={600} height={300} data={analytics.topQuizCompleters}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalScore" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}