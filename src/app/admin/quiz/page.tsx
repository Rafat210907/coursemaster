'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Plus, Trash2, Save, BookOpen, HelpCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function QuizBuilder() {
  const [title, setTitle] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    toast.success('Question added');
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    toast.success('Question removed');
  };

  const updateQuestion = (index: number, field: string, value: string | number | string[]) => {
    const newQuestions = [...questions];
    if (field === 'question' && typeof value === 'string') {
      newQuestions[index].question = value;
    } else if (field === 'option' && Array.isArray(value)) {
      newQuestions[index].options = value;
    } else if (field === 'correctAnswer' && typeof value === 'number') {
      newQuestions[index].correctAnswer = value;
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Quiz title is required');
      return;
    }

    if (!lessonId.trim()) {
      toast.error('Lesson ID is required (you can find this in the lesson management section)');
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
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ title, lessonId, questions }),
      });

      if (!response.ok) {
        throw new Error('Failed to create quiz');
      }

      toast.success('Quiz created successfully!');
      setTitle('');
      setLessonId('');
      setQuestions([]);
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast.error('Failed to create quiz. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Quiz Builder</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="h-5 w-5" />
            Create New Quiz
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quiz Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Quiz Title *
                </label>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter quiz title"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Lesson ID *
                </label>
                <Input
                  type="text"
                  value={lessonId}
                  onChange={(e) => setLessonId(e.target.value)}
                  placeholder="Enter lesson ID"
                  className="w-full"
                  required
                />
              </div>
            </div>

            {/* Questions Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Questions</h2>
                <Button
                  type="button"
                  onClick={addQuestion}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Question
                </Button>
              </div>

              {questions.length === 0 && (
                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">No questions added yet</p>
                  <p className="text-sm">Click &quot;Add Question&quot; to start building your quiz</p>
                </div>
              )}

              {questions.map((question, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                      <Button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Question Text */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Question Text *</label>
                      <Input
                        type="text"
                        placeholder="Enter your question here"
                        value={question.question}
                        onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                        className="w-full"
                        required
                      />
                    </div>

                    {/* Answer Options */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700">Answer Options *</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600 w-6">
                              {String.fromCharCode(65 + optionIndex)}.
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
                              className="flex-1"
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Correct Answer Selector */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Correct Answer *</label>
                      <select
                        value={question.correctAnswer}
                        onChange={(e) => updateQuestion(index, 'correctAnswer', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        {question.options.map((_, optionIndex) => (
                          <option key={optionIndex} value={optionIndex}>
                            {String.fromCharCode(65 + optionIndex)} - Option {optionIndex + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Submit Button */}
            {questions.length > 0 && (
              <div className="flex justify-end pt-6 border-t">
                <Button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-8 py-2 text-lg"
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
  );
}