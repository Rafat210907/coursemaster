'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTutors, createTutor, updateTutor, deleteTutor } from '../../store/slices/tutorSlice';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { RootState, AppDispatch } from '../../store/store';
import { Tutor } from '../../../types';
import Image from 'next/image';
import { Plus, Edit, Trash2, User, Users, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminTutors() {
  const dispatch = useDispatch<AppDispatch>();
  const { tutors, loading, error } = useSelector((state: RootState) => state.tutors);
  const { user } = useSelector((state: RootState) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [editingTutor, setEditingTutor] = useState<Tutor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    expertise: '',
    experience: 0,
    profileImage: '',
    totalStudents: 0,
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(fetchTutors({}));
    }
  }, [dispatch, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      const tutorData = {
        ...formData,
        expertise: formData.expertise.split(',').map(exp => exp.trim()).filter(exp => exp),
      };

      if (editingTutor) {
        await dispatch(updateTutor({ id: editingTutor._id, tutorData })).unwrap();
        toast.success('Tutor updated successfully');
      } else {
        await dispatch(createTutor(tutorData)).unwrap();
        toast.success('Tutor created successfully');
      }

      // Refetch tutors to ensure the list is up to date
      dispatch(fetchTutors({}));

      setShowForm(false);
      setEditingTutor(null);
      resetForm();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save tutor';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (tutor: Tutor) => {
    setEditingTutor(tutor);
    setFormData({
      name: tutor.name,
      bio: tutor.bio || '',
      expertise: tutor.expertise.join(', '),
      experience: tutor.experience,
      profileImage: tutor.profileImage || '',
      totalStudents: tutor.totalStudents,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tutor?')) return;

    try {
      await dispatch(deleteTutor(id)).unwrap();
      toast.success('Tutor deleted successfully');
      // Refetch tutors to ensure the list is up to date
      dispatch(fetchTutors({}));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete tutor';
      toast.error(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      bio: '',
      expertise: '',
      experience: 0,
      profileImage: '',
      totalStudents: 0,
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTutor(null);
    resetForm();
  };

  if (user?.role !== 'admin') {
    return <div className="p-6">Access denied. Admin only.</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tutor Management</h1>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus size={20} />
          Add Tutor
        </Button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingTutor ? 'Edit Tutor' : 'Add New Tutor'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Tutor name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Brief biography"
                  className="w-full p-2 border rounded-md"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Expertise (comma-separated)</label>
                  <Input
                    type="text"
                    value={formData.expertise}
                    onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                    placeholder="JavaScript, React, Node.js"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Experience (years)</label>
                  <Input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Profile Image URL</label>
                <Input
                  type="url"
                  value={formData.profileImage}
                  onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.profileImage && (
                  <div className="mt-3 flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 shrink-0">
                      <Image
                        src={formData.profileImage}
                        alt="Profile preview"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Profile image preview</p>
                      <p className="text-xs text-gray-500">This image will be used for the tutor&apos;s profile</p>
                    </div>
                  </div>
                )}
              </div>
              {/* Active/Inactive toggle removed: automated based on courses */}

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingTutor ? 'Update Tutor' : 'Create Tutor'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      {!showForm && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <Card key={tutor._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {tutor.profileImage ? (
                        <Image
                          src={tutor.profileImage}
                          alt={tutor.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <User size={24} className="text-gray-500" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">{tutor.name}</CardTitle>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(tutor)}
                        className="p-2"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(tutor._id)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tutor.bio && (
                      <p className="text-sm text-gray-600 line-clamp-2">{tutor.bio}</p>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {tutor.expertise.slice(0, 3).map((exp, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {exp}
                        </span>
                      ))}
                      {tutor.expertise.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{tutor.expertise.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users size={14} className="text-blue-500" />
                          <span>{tutor.totalStudents}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award size={14} className="text-green-500" />
                          <span>{tutor.experience}y</span>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        tutor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {tutor.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {tutors.length === 0 && !loading && (
            <div className="text-center py-12">
              <User size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tutors found</h3>
              <p className="text-gray-500">Get started by adding your first tutor.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}