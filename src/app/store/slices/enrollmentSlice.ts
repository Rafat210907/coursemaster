import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import { Enrollment } from '@/types';

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
      .addCase(enrollCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enrollCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments.push(action.payload);
      })
      .addCase(enrollCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to enroll';
      })
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments = action.payload;
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch enrollments';
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