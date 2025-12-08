'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../store/slices/authSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { RootState, AppDispatch } from '../store/store';
import { Camera, User as UserIcon, Calendar, Shield } from 'lucide-react';
import Image from 'next/image';

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to change password';
      }
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'New password must be at least 6 characters';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const updateData: { name?: string; email?: string; currentPassword?: string; newPassword?: string } = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      await dispatch(updateProfile(updateData)).unwrap();
      setIsEditing(false);
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      if (err.response?.data?.message) {
        setErrors({ general: err.response.data.message });
      } else {
        setErrors({ general: 'Failed to update profile' });
      }
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);

      try {
        // This would need to be implemented in the backend
        // const response = await api.post('/upload/avatar', formData);
        // dispatch(updateProfile({ avatar: response.data.avatarUrl }));
        alert('Avatar upload functionality would be implemented here');
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Required</h1>
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const gravatarUrl = `https://www.gravatar.com/avatar/${user.email}?d=identicon&s=150`;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <Image
                        src={user.avatar || gravatarUrl}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="w-full h-full rounded-full object-cover"
                      />
                      {isEditing && (
                        <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer hover:bg-primary/90 transition-colors">
                          <Camera className="h-4 w-4" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
                    <p className="text-muted-foreground mb-4">{user.email}</p>
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      <Shield className="h-3 w-3" />
                      {user.role === 'admin' ? 'Administrator' : 'Student'}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Stats */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Member since</p>
                      <p className="text-sm text-muted-foreground">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Account type</p>
                      <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your account details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {errors.general && (
                    <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                      <p className="text-destructive text-sm">{errors.general}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <Input
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          disabled={!isEditing}
                          className={errors.name ? 'border-destructive' : ''}
                        />
                        {errors.name && (
                          <p className="text-destructive text-sm mt-1">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!isEditing}
                          className={errors.email ? 'border-destructive' : ''}
                        />
                        {errors.email && (
                          <p className="text-destructive text-sm mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <>
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-medium mb-4">Change Password</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Current Password</label>
                              <Input
                                type="password"
                                value={formData.currentPassword}
                                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                                placeholder="Enter current password"
                                className={errors.currentPassword ? 'border-destructive' : ''}
                              />
                              {errors.currentPassword && (
                                <p className="text-destructive text-sm mt-1">{errors.currentPassword}</p>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">New Password</label>
                                <Input
                                  type="password"
                                  value={formData.newPassword}
                                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                  placeholder="Enter new password"
                                  className={errors.newPassword ? 'border-destructive' : ''}
                                />
                                {errors.newPassword && (
                                  <p className="text-destructive text-sm mt-1">{errors.newPassword}</p>
                                )}
                              </div>

                              <div>
                                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                                <Input
                                  type="password"
                                  value={formData.confirmPassword}
                                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                  placeholder="Confirm new password"
                                  className={errors.confirmPassword ? 'border-destructive' : ''}
                                />
                                {errors.confirmPassword && (
                                  <p className="text-destructive text-sm mt-1">{errors.confirmPassword}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-6 border-t">
                          <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsEditing(false);
                              setErrors({});
                              setFormData({
                                name: user.name || '',
                                email: user.email || '',
                                currentPassword: '',
                                newPassword: '',
                                confirmPassword: '',
                              });
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}