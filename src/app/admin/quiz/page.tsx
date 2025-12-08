'use client';

import { useState } from 'react';
import api from '../../../lib/axios';

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
  };

  const updateQuestion = (index: number, field: string, value: string | number | string[]) => {
    const newQuestions = [...questions];
    if (field === 'question') {
      newQuestions[index].question = value;
    } else if (field === 'option') {
      newQuestions[index].options = value;
    } else if (field === 'correctAnswer') {
      newQuestions[index].correctAnswer = value;
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/quizzes', { title, lessonId, questions });
      alert('Quiz created!');
      setTitle('');
      setLessonId('');
      setQuestions([]);
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create Quiz</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Lesson ID</label>
          <input
            type="text"
            value={lessonId}
            onChange={(e) => setLessonId(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <h2 className="text-xl mb-2">Questions</h2>
          {questions.map((q, i) => (
            <div key={i} className="border p-4 mb-4 rounded">
              <input
                type="text"
                placeholder="Question"
                value={q.question}
                onChange={(e) => updateQuestion(i, 'question', e.target.value)}
                className="w-full border p-2 rounded mb-2"
                required
              />
              {q.options.map((opt, j) => (
                <input
                  key={j}
                  type="text"
                  placeholder={`Option ${j + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...q.options];
                    newOpts[j] = e.target.value;
                    updateQuestion(i, 'option', newOpts);
                  }}
                  className="w-full border p-2 rounded mb-2"
                  required
                />
              ))}
              <select
                value={q.correctAnswer}
                onChange={(e) => updateQuestion(i, 'correctAnswer', Number(e.target.value))}
                className="border p-2 rounded"
              >
                {q.options.map((_, j) => (
                  <option key={j} value={j}>Option {j + 1}</option>
                ))}
              </select>
            </div>
          ))}
          <button type="button" onClick={addQuestion} className="bg-gray-500 text-white px-4 py-2 rounded">
            Add Question
          </button>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Quiz
        </button>
      </form>
    </div>
  );
}