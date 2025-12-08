'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { updateProgress } from '../../store/slices/enrollmentSlice';
import ReactPlayer from 'react-player';
import api from '../../../lib/axios';

interface Quiz {
  _id: string;
  title: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export default function LessonPlayer() {
  const { courseId } = useParams();
  const dispatch = useDispatch<any>();
  const { enrollments } = useSelector((state: any) => state.enrollments);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const enrollment = enrollments.find((e: any) => e.course._id === courseId);

  const lessons = enrollment?.course?.lessons || [];

  useEffect(() => {
    if (lesson) {
      fetchQuiz();
    }
  }, [currentLesson]);

  const fetchQuiz = async () => {
    try {
      const response = await api.get(`/quizzes/lesson/${lesson._id}`);
      if (response.data.length > 0) {
        setQuiz(response.data[0]);
        setAnswers(new Array(response.data[0].questions.length).fill(-1));
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  const handleComplete = () => {
    if (enrollment && lessons[currentLesson]) {
      dispatch(updateProgress({ enrollmentId: enrollment._id, lessonId: lessons[currentLesson]._id }));
      if (currentLesson < lessons.length - 1) {
        setCurrentLesson(currentLesson + 1);
      }
    }
  };

  const handleQuizSubmit = async () => {
    if (!quiz) return;
    try {
      const response = await api.post('/quizzes/submit', { quizId: quiz._id, answers });
      setScore(response.data.score);
      setQuizSubmitted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  if (!enrollment) return <p>Enrollment not found</p>;

  const lesson = lessons[currentLesson];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Lesson Player</h1>
      {lesson ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">{lesson.title}</h2>
          <div className="mb-4">
            {/* @ts-ignore */}
            <ReactPlayer url={lesson.videoUrl as string} controls width="100%" height="400px" />
          </div>
          <button onClick={handleComplete} className="bg-green-500 text-white px-4 py-2 rounded">
            Mark as Completed
          </button>
          {quiz && !quizSubmitted && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">{quiz.title}</h3>
              {quiz.questions.map((q, i) => (
                <div key={i} className="mb-4">
                  <p className="font-medium">{q.question}</p>
                  {q.options.map((opt, j) => (
                    <label key={j} className="block">
                      <input
                        type="radio"
                        name={`q${i}`}
                        value={j}
                        checked={answers[i] === j}
                        onChange={() => {
                          const newAnswers = [...answers];
                          newAnswers[i] = j;
                          setAnswers(newAnswers);
                        }}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              ))}
              <button onClick={handleQuizSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
                Submit Quiz
              </button>
            </div>
          )}
          {quizSubmitted && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold">Quiz Results</h3>
              <p>Score: {score} / {quiz?.questions.length}</p>
            </div>
          )}
        </div>
      ) : (
        <p>No lessons available</p>
      )}
    </div>
  );
}