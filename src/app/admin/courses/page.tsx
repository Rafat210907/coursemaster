'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCourses, createCourse, updateCourse, deleteCourse } from '../../store/slices/adminSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { RootState, AppDispatch } from '../../store/store';
import { Course } from '../../../types';
import { Plus, Edit, Trash2, BookOpen, Users, DollarSign } from 'lucide-react';

export default function AdminCourses() {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading, error } = useSelector((state: RootState) => state.admin);
  const { user } = useSelector((state: RootState) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    instructor: '',
    tags: '',
    syllabus: [{ title: '', content: '' }],
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(fetchAllCourses());
    }
  }, [dispatch, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const courseData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()),
      syllabus: formData.syllabus.filter(item => item.title && item.content),
    };

    try {
      if (editingCourse) {
        await dispatch(updateCourse({ id: editingCourse._id, data: courseData }));
      } else {
        await dispatch(createCourse(courseData));
      }
      setShowForm(false);
      setEditingCourse(null);
      resetForm();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      price: course.price,
      category: course.category,
      instructor: course.instructor,
      tags: course.tags.join(', '),
      syllabus: course.syllabus.length > 0 ? course.syllabus : [{ title: '', content: '' }],
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        await dispatch(deleteCourse(id));
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      category: '',
      instructor: '',
      tags: '',
      syllabus: [{ title: '', content: '' }],
    });
  };

  const addSyllabusItem = () => {
    setFormData({
      ...formData,
      syllabus: [...formData.syllabus, { title: '', content: '' }],
    });
  };

  const updateSyllabusItem = (index: number, field: string, value: string) => {
    const newSyllabus = [...formData.syllabus];
    newSyllabus[index] = { ...newSyllabus[index], [field]: value };
    setFormData({ ...formData, syllabus: newSyllabus });
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">Admin access required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Course Management</h1>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Input
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-input bg-background px-3 py-2 rounded-md min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price ($)</label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Instructor</label>
                    <Input
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="javascript, react, web-development"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Syllabus</label>
                  {formData.syllabus.map((item, index) => (
                    <div key={index} className="mb-4 p-4 border rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <Input
                          placeholder="Section title"
                          value={item.title}
                          onChange={(e) => updateSyllabusItem(index, 'title', e.target.value)}
                        />
                      </div>
                      <textarea
                        placeholder="Section content"
                        value={item.content}
                        onChange={(e) => updateSyllabusItem(index, 'content', e.target.value)}
                        className="w-full border border-input bg-background px-3 py-2 rounded-md min-h-[60px]"
                      />
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addSyllabusItem}>
                    Add Section
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {editingCourse ? 'Update Course' : 'Create Course'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setShowForm(false);
                    setEditingCourse(null);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-4"></div>
                    <div className="h-6 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  <CardDescription>{course.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{course.lessons.length} lessons</span>
                    </div>
                    <div className="flex items-center gap-2 text-lg font-bold">
                      <DollarSign className="h-4 w-4" />
                      <span>{course.price}</span>
                    </div>
                  </div>
                </CardContent>
                <div className="p-6 pt-0 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(course)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(course._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}