'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Plus, Trash2, Save, BookOpen, HelpCircle, CheckCircle, ChevronDown, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { Course, Lesson } from '../../../types';
import api from '../../../lib/axios';

interface Question {
  question: string;
  options: string[];
  type: 'single' | 'multiple';
  correctAnswers: number[];
}

import { AdminSidebar } from '../../../components/AdminSidebar';

export default function QuizBuilder() {
  const [title, setTitle] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    const fetchCoursesList = async () => {
      setLoadingCourses(true);
      try {
        const response = await api.get('/courses?limit=100');
        setCourses(response.data.courses || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCoursesList();
  }, []);

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], type: 'single', correctAnswers: [0] }]);
    toast.success('Question added');
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    toast.success('Question removed');
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    if (field === 'question') {
      newQuestions[index].question = value;
    } else if (field === 'option') {
      newQuestions[index].options = value;
    } else if (field === 'type') {
      newQuestions[index].type = value;
      // Reset correct answers when switching types to avoid single-type questions with multiple correct answers
      newQuestions[index].correctAnswers = [0];
    } else if (field === 'correctAnswers') {
      newQuestions[index].correctAnswers = value;
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Quiz title is required');
      return;
    }

    if (!selectedCourseId) {
      toast.error('Please select a course');
      return;
    }

    if (questions.length === 0) {
      toast.error('At least one question is required');
      return;
    }

    // Validate all questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        toast.error(`Question ${i + 1} text is required`);
        return;
      }
      if (q.options.some(opt => !opt.trim())) {
        toast.error(`Question ${i + 1} must have all 4 options filled`);
        return;
      }
      if (q.correctAnswers.length === 0) {
        toast.error(`Question ${i + 1} must have at least one correct answer`);
        return;
      }
    }

    try {
      await api.post('/quizzes', {
        title,
        course: selectedCourseId,
        questions: questions.map(q => ({
          ...q,
          correctAnswer: q.correctAnswers[0], // for backward compatibility
        }))
      });

      toast.success('Quiz created successfully!');
      setTitle('');
      setSelectedCourseId('');
      setQuestions([]);
    } catch (error: any) {
      console.error('Error creating quiz:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to create quiz';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-4 md:p-8 overflow-x-hidden relative">
          {/* Blurred Decorative Background Elements */}
          <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px] -z-0 pointer-events-none" />
          <div className="absolute bottom-40 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-0 pointer-events-none" />

          <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="h-8 w-8 text-primary" />
              <h1 className="text-2xl md:text-3xl font-bold">Quiz Builder</h1>
            </div>

            <Card className="shadow-premium border-none bg-card/30 backdrop-blur-2xl border border-white/5 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
              <CardHeader className="relative z-10 border-b border-white/10 bg-muted/30">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BookOpen className="h-5 w-5" />
                  Create New Quiz
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 relative z-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Quiz Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Quiz Title *
                      </label>
                      <Input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter quiz title"
                        className="w-full bg-background/50 border-input"
                        required
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Select Course *
                      </label>
                      <select
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="w-full p-2 border border-input rounded-md bg-background/50"
                        required
                      >
                        <option value="">Choose a course</option>
                        {courses.map(course => (
                          <option key={course._id} value={course._id}>{course.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Questions Section */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <h2 className="text-xl font-semibold text-foreground/90">Questions</h2>
                      <Button
                        type="button"
                        onClick={addQuestion}
                        className="flex items-center gap-2 w-full sm:w-auto"
                      >
                        <Plus className="h-4 w-4" />
                        Add Question
                      </Button>
                    </div>

                    {questions.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-muted rounded-lg bg-accent/5">
                        <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p className="text-lg font-medium">No questions added yet</p>
                        <p className="text-sm">Click &quot;Add Question&quot; to start building your quiz</p>
                      </div>
                    )}

                    {questions.map((question, index) => (
                      <Card key={index} className="border border-white/10 hover:border-primary/50 transition-colors bg-card/40 backdrop-blur-md shadow-sm">
                        <CardHeader className="pb-3 border-b border-white/5 bg-muted/10">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                            <Button
                              type="button"
                              onClick={() => removeQuestion(index)}
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                          {/* Question Text and Type */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-3 space-y-2">
                              <label className="text-sm font-medium text-foreground/80">Question Text *</label>
                              <Input
                                type="text"
                                placeholder="Enter your question here"
                                value={question.question}
                                onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                                className="w-full bg-background/50"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground/80">Type</label>
                              <select
                                value={question.type}
                                onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                                className="w-full p-2 border border-input rounded-md bg-background/50"
                              >
                                <option value="single">Single Choice</option>
                                <option value="multiple">Multiple Choice</option>
                              </select>
                            </div>
                          </div>

                          {/* Answer Options */}
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground/80">Answer Options *</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {question.options.map((option, optionIndex) => {
                                const isSelected = question.correctAnswers.includes(optionIndex);
                                return (
                                  <div key={optionIndex} className="flex items-center gap-2 group">
                                    <span className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold transition-colors ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                      {String.fromCharCode(65 + optionIndex)}
                                    </span>
                                    <Input
                                      type="text"
                                      placeholder={`Option ${optionIndex + 1}`}
                                      value={option}
                                      onChange={(e) => {
                                        const newOptions = [...question.options];
                                        newOptions[optionIndex] = e.target.value;
                                        updateQuestion(index, 'option', newOptions);
                                      }}
                                      className={`flex-1 bg-background/50 ${isSelected ? 'border-primary' : ''}`}
                                      required
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Correct Answer Selector */}
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground/80">
                              {question.type === 'single' ? 'Select Correct Answer *' : 'Select Correct Answers *'}
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {question.options.map((_, optionIndex) => {
                                const isSelected = question.correctAnswers.includes(optionIndex);
                                return (
                                  <button
                                    key={optionIndex}
                                    type="button"
                                    onClick={() => {
                                      let newCorrectAnswers = [...question.correctAnswers];
                                      if (question.type === 'single') {
                                        newCorrectAnswers = [optionIndex];
                                      } else {
                                        if (isSelected) {
                                          newCorrectAnswers = newCorrectAnswers.filter(i => i !== optionIndex);
                                        } else {
                                          newCorrectAnswers.push(optionIndex);
                                        }
                                      }
                                      updateQuestion(index, 'correctAnswers', newCorrectAnswers);
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border-2 ${isSelected
                                      ? 'bg-primary border-primary text-primary-foreground shadow-md'
                                      : 'bg-background/50 border-muted text-muted-foreground hover:border-primary/50 hover:text-primary'
                                      }`}
                                  >
                                    Option {String.fromCharCode(65 + optionIndex)}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Submit Button */}
                  {questions.length > 0 && (
                    <div className="flex justify-end pt-6 border-t border-white/10">
                      <Button
                        type="submit"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-8 py-2 text-lg shadow-lg"
                      >
                        <Save className="h-5 w-5" />
                        Create Quiz
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}