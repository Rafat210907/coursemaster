import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import { Course } from '@/types';

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
};

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (params: { page?: number; search?: string; category?: string }) => {
    const response = await api.get('/courses', { params });
    return response.data;
  }
);

export const fetchCourse = createAsyncThunk('courses/fetchCourse', async (id: string) => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
});

export const createCourse = createAsyncThunk('courses/createCourse', async (courseData: Omit<Course, '_id' | 'createdAt' | 'averageRating' | 'reviewCount'>) => {
  const response = await api.post('/courses', courseData);
  return response.data;
});

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch courses';
      })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.currentCourse = action.payload;
      })
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.push(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create course';
      });
  },
});

export default courseSlice.reducer;