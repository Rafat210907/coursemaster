'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCourses, createCourse, updateCourse, deleteCourse } from '../../store/slices/adminSlice';
import { fetchTutors } from '../../store/slices/tutorSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { RootState, AppDispatch } from '../../store/store';
import { Course } from '../../../types';
import { Plus, Edit, Trash2, BookOpen, Users, DollarSign, Star, Clock, Check, ChevronDown, Search, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

import { AdminSidebar } from '../../../components/AdminSidebar';

export default function AdminCourses() {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading, error } = useSelector((state: RootState) => state.admin);
  const { tutors } = useSelector((state: RootState) => state.tutors);
  const { user } = useSelector((state: RootState) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    duration: 0,
    category: '',
    instructors: [] as string[],
    tags: '',
    syllabus: [{ title: '', content: '' }],
  });
  const [instructorSearch, setInstructorSearch] = useState('');
  const [isInstructorDropdownOpen, setIsInstructorDropdownOpen] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(fetchAllCourses());
      dispatch(fetchTutors({}));
    }
  }, [dispatch, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (formData.title.trim().length < 3) {
      toast.error('Title must be at least 3 characters long');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (formData.description.trim().length < 10) {
      toast.error('Description must be at least 10 characters long');
      return;
    }
    if (formData.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }
    if (formData.duration <= 0) {
      toast.error('Duration must be greater than 0');
      return;
    }
    if (!formData.category.trim()) {
      toast.error('Category is required');
      return;
    }
    if (formData.instructors.length === 0) {
      toast.error('At least one instructor is required');
      return;
    }

    const courseData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: formData.price,
      duration: formData.duration,
      category: formData.category.trim(),
      instructors: formData.instructors,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      syllabus: formData.syllabus.filter(item => item.title.trim().length > 0 && item.content.trim().length > 0),
    };

    try {
      if (editingCourse) {
        await dispatch(updateCourse({ id: editingCourse._id, data: courseData }));
      } else {
        await dispatch(createCourse(courseData));
      }
      setShowForm(false);
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        price: 0,
        duration: 0,
        category: '',
        instructors: [],
        tags: '',
        syllabus: [{ title: '', content: '' }],
      });
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
      duration: course.duration,
      category: course.category,
      instructors: (course.instructors || []).map(inst => typeof inst === 'object' ? inst._id : inst),
      tags: (course.tags || []).join(', '),
      syllabus: (course.syllabus || []).length > 0 ? course.syllabus : [{ title: '', content: '' }],
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
      duration: 0,
      category: '',
      instructors: [],
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
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 container mx-auto px-6 py-8">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left Side - Form */}
              <Card>
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <label className="block text-sm font-medium mb-2">Duration (hours)</label>
                        <Input
                          type="number"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                          required
                          min="0"
                          step="0.5"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-sm font-medium mb-2">Instructors</label>
                        <div className="relative">
                          <div
                            onClick={() => setIsInstructorDropdownOpen(!isInstructorDropdownOpen)}
                            className="w-full flex flex-wrap items-center gap-2 p-2 border rounded-md bg-background hover:bg-muted/50 transition-colors min-h-[42px] cursor-pointer"
                          >
                            {formData.instructors.length > 0 ? (
                              <div className="flex flex-wrap gap-1 flex-1">
                                {formData.instructors.map(instId => {
                                  const tutor = tutors.find(t => t._id === instId);
                                  return (
                                    <div key={instId} className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full border border-primary/20">
                                      {tutor?.name || 'Unknown'}
                                      <button
                                        type="button"
                                        className="hover:text-destructive shrink-0"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setFormData({
                                            ...formData,
                                            instructors: formData.instructors.filter(id => id !== instId)
                                          });
                                        }}
                                      >
                                        <Trash2 size={10} />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-muted-foreground flex-1 text-left">Select instructors</span>
                            )}
                            <ChevronDown size={16} className={`text-muted-foreground transition-transform shrink-0 ${isInstructorDropdownOpen ? 'rotate-180' : ''}`} />
                          </div>

                          {isInstructorDropdownOpen && (
                            <div className="absolute z-50 mt-1 w-full max-w-[300px] md:max-w-none bg-popover text-popover-foreground border rounded-md shadow-xl animate-in fade-in zoom-in duration-200">
                              <div className="p-2 border-b sticky top-0 bg-popover z-10">
                                <div className="relative">
                                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                  <Input
                                    placeholder="Search tutors..."
                                    value={instructorSearch}
                                    onChange={(e) => setInstructorSearch(e.target.value)}
                                    className="pl-9 h-8 text-sm"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              </div>
                              <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                                {tutors
                                  .filter(t => t.name.toLowerCase().includes(instructorSearch.toLowerCase()) ||
                                    t.expertise.join(' ').toLowerCase().includes(instructorSearch.toLowerCase()))
                                  .map((tutor) => (
                                    <button
                                      key={tutor._id}
                                      type="button"
                                      onClick={() => {
                                        const isSelected = formData.instructors.includes(tutor._id);
                                        const newInstructors = isSelected
                                          ? formData.instructors.filter(id => id !== tutor._id)
                                          : [...formData.instructors, tutor._id];
                                        setFormData({ ...formData, instructors: newInstructors });
                                      }}
                                      className={`w-full flex items-start gap-3 p-2 rounded-sm hover:bg-accent text-left transition-colors ${formData.instructors.includes(tutor._id) ? 'bg-accent/50' : ''}`}
                                    >
                                      {tutor.profileImage ? (
                                        <Image
                                          src={tutor.profileImage}
                                          alt={tutor.name}
                                          width={32}
                                          height={32}
                                          className="w-8 h-8 rounded-full object-cover mt-0.5 shrink-0"
                                          unoptimized
                                        />
                                      ) : (
                                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mt-0.5 shrink-0">
                                          <UserIcon size={16} className="text-muted-foreground" />
                                        </div>
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1">
                                          <div className="font-medium text-sm truncate">{tutor.name}</div>
                                          {formData.instructors.includes(tutor._id) && <Check size={14} className="text-primary shrink-0" />}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground line-clamp-1">
                                          {tutor.expertise.join(', ')}
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                                {tutors.length === 0 && (
                                  <div className="p-4 text-center text-sm text-muted-foreground">
                                    No tutors found
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
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

              {/* Right Side - Preview */}
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>How the course will appear to students</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Course Header */}
                    <div>
                      <h1 className="text-3xl font-bold mb-4">{formData.title || 'Course Title'}</h1>
                      <p className="text-xl text-muted-foreground mb-4">{formData.description || 'Course description will appear here...'}</p>

                      <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">N/A</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm">💬</span>
                          <span className="text-sm">0 reviews</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{formData.category || 'Category'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{formData.duration ? `${formData.duration} hours` : 'Duration'}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {formData.tags ? formData.tags.split(',').map((tag, index) => (
                          <span key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                            {tag.trim()}
                          </span>
                        )) : (
                          <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                            Sample Tag
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Syllabus Preview */}
                    {formData.syllabus.some(item => item.title || item.content) && (
                      <div>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          Course Syllabus
                        </h2>
                        <div className="space-y-4">
                          {formData.syllabus.filter(item => item.title || item.content).map((item, index) => (
                            <div key={index} className="border-l-2 border-primary pl-4">
                              <h3 className="font-semibold mb-2">{item.title || 'Section Title'}</h3>
                              <p className="text-muted-foreground text-sm">{item.content || 'Section content will appear here...'}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sidebar Preview */}
                    <div className="border-t pt-6">
                      <div className="text-center mb-6">
                        <div className="text-3xl font-bold mb-2">${formData.price || '0'}</div>
                        <div className="text-muted-foreground">One-time payment</div>
                      </div>

                      <div className="bg-muted/50 p-4 rounded-lg mb-6">
                        <div className="text-center text-sm font-medium text-green-600 mb-2">
                          ✓ Already Enrolled
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          Preview shows enrolled state
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>Instructors: {formData.instructors.length > 0 ? formData.instructors.map(id => tutors.find(t => t._id === id)?.name).join(', ') : 'None'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Self-paced learning</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {!showForm && (
            loading ? (
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
                          <span>{(course.instructors || []).map(inst => typeof inst === 'object' ? inst.name : 'Unknown').join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{(course.lessons || []).length} lessons</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration} hours</span>
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
            )
          )}
        </div>
      </div>
    </div>
  );
}