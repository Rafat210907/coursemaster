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

import { AdminSidebar } from '../../../components/AdminSidebar';

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
      const errorMessage = typeof error === 'string' ? error : 'Failed to save tutor';
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
      const errorMessage = typeof error === 'string' ? error : 'Failed to delete tutor';
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
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-4 md:p-8 overflow-x-hidden relative">
          {/* Blurred Decorative Background Elements */}
          <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px] -z-0 pointer-events-none" />
          <div className="absolute bottom-40 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-0 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h1 className="text-2xl md:text-3xl font-bold">Tutor Management</h1>
              <Button onClick={() => setShowForm(true)} className="flex items-center gap-2 w-full sm:w-auto justify-center">
                <Plus size={20} />
                Add Tutor
              </Button>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

            {showForm && (
              <Card className="mb-6 border-none shadow-premium bg-card/30 backdrop-blur-2xl border border-white/5 overflow-hidden relative z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <CardHeader className="relative z-10 border-b border-white/10 bg-muted/30">
                  <CardTitle>{editingTutor ? 'Edit Tutor' : 'Add New Tutor'}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 pt-6">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                  {tutors.map((tutor) => (
                    <Card key={tutor._id} className="group border-none shadow-premium overflow-hidden transition-all hover:translate-y-[-2px] bg-card/30 backdrop-blur-2xl border border-white/5 relative z-10">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                      <div className="h-1.5 bg-gradient-to-r from-primary to-primary/40" />
                      <CardHeader className="pb-3 relative z-10">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {tutor.profileImage ? (
                              <Image
                                src={tutor.profileImage}
                                alt={tutor.name}
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                                unoptimized
                              />
                            ) : (
                              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                                <User size={24} className="text-primary" />
                              </div>
                            )}
                            <div>
                              <CardTitle className="text-lg">{tutor.name}</CardTitle>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(tutor)}
                              className="p-2 h-8 w-8 hover:bg-primary/10 hover:text-primary"
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(tutor._id)}
                              className="p-2 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="space-y-4">
                          {tutor.bio && (
                            <p className="text-sm text-muted-foreground line-clamp-2 italic border-l-2 border-primary/20 pl-3">"{tutor.bio}"</p>
                          )}

                          <div className="flex flex-wrap gap-1">
                            {tutor.expertise.slice(0, 3).map((exp, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-wider rounded-md"
                              >
                                {exp}
                              </span>
                            ))}
                            {tutor.expertise.length > 3 && (
                              <span className="px-2 py-1 bg-muted text-muted-foreground text-[10px] font-bold rounded-md">
                                +{tutor.expertise.length - 3}
                              </span>
                            )}
                          </div>

                          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5 bg-blue-500/10 px-2 py-1 rounded-full text-blue-600">
                                <Users size={14} />
                                <span className="font-semibold">{tutor.totalStudents}</span>
                              </div>
                              <div className="flex items-center gap-1.5 bg-green-500/10 px-2 py-1 rounded-full text-green-600">
                                <Award size={14} />
                                <span className="font-semibold">{tutor.experience}y</span>
                              </div>
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
        </div>
      </div>
    </div>
  );
}