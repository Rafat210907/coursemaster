import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import { Enrollment, Course } from '@/types';

interface EnrollmentState {
  enrollments: Enrollment[];
  loading: boolean;
  error: string | null;
}

const initialState: EnrollmentState = {
  enrollments: [],
  loading: false,
  error: null,
};

export const enrollCourse = createAsyncThunk(
  'enrollments/enroll',
  async (courseId: string) => {
    const response = await api.post('/enrollments/enroll', { courseId });
    return response.data;
  }
);

export const fetchEnrolledCourses = createAsyncThunk('enrollments/fetch', async () => {
  const response = await api.get('/enrollments/my');
  return response.data;
});

export const updateProgress = createAsyncThunk(
  'enrollments/updateProgress',
  async ({ enrollmentId, lessonId }: { enrollmentId: string; lessonId: string }) => {
    const response = await api.put('/enrollments/progress', { enrollmentId, lessonId });
    return response.data;
  }
);

const enrollmentSlice = createSlice({
  name: 'enrollments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(enrollCourse.fulfilled, (state, action) => {
        state.enrollments.push(action.payload);
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.enrollments = action.payload;
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        const index = state.enrollments.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.enrollments[index] = action.payload;
        }
      });
  },
});

export default enrollmentSlice.reducer;