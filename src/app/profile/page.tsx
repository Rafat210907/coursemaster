'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../../lib/axios';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export default function Profile() {
  const { user } = useSelector((state: any) => state.auth);
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      setProfile(user);
    }
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      try {
        const response = await api.post('/upload/avatar', formData);
        setProfile({ ...profile!, avatar: response.data.avatarUrl });
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  if (!profile) return <p>Please login</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <img src={profile.avatar || `https://www.gravatar.com/avatar/${profile.email}?d=identicon`} alt="Avatar" className="w-24 h-24 rounded-full" />
          <input type="file" onChange={handleAvatarUpload} className="mt-2" />
        </div>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
      </div>
    </div>
  );
}