'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { updateProgress } from '../../store/slices/enrollmentSlice';
import ReactPlayer from 'react-player';

export default function LessonPlayer() {
  const { courseId } = useParams();
  const dispatch = useDispatch<any>();
  const { enrollments } = useSelector((state: any) => state.enrollments);
  const [currentLesson, setCurrentLesson] = useState(0);

  const enrollment = enrollments.find((e: any) => e.course._id === courseId);

  const lessons = enrollment?.course?.lessons || [];

  const handleComplete = () => {
    if (enrollment && lessons[currentLesson]) {
      dispatch(updateProgress({ enrollmentId: enrollment._id, lessonId: lessons[currentLesson]._id }));
      if (currentLesson < lessons.length - 1) {
        setCurrentLesson(currentLesson + 1);
      }
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
            <ReactPlayer url={lesson.videoUrl} controls width="100%" height="400px" />
          </div>
          <button onClick={handleComplete} className="bg-green-500 text-white px-4 py-2 rounded">
            Mark as Completed
          </button>
        </div>
      ) : (
        <p>No lessons available</p>
      )}
    </div>
  );
}