'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../../lib/axios';
import MD5 from 'crypto-js/md5';
import Image from 'next/image';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export default function Profile() {
  const { user } = useSelector((state: any) => state.auth);
  const [profile, setProfile] = useState<User | null>(user);

  useEffect(() => {
    setProfile(user);
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

  const gravatarUrl = profile ? `https://www.gravatar.com/avatar/${MD5(profile.email.toLowerCase()).toString()}?d=identicon` : '';

  if (!profile) return <p>Please login</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <Image src={profile.avatar || gravatarUrl} alt="Avatar" width={96} height={96} className="rounded-full" />
          <input type="file" onChange={handleAvatarUpload} className="mt-2" />
        </div>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
      </div>
    </div>
  );
}