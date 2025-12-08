import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import { Course, Enrollment, Assignment, Analytics } from '@/types';

interface AdminState {
  courses: Course[];
  enrollments: Enrollment[];
  assignments: Assignment[];
  analytics: Analytics | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  courses: [],
  enrollments: [],
  assignments: [],
  analytics: null,
  loading: false,
  error: null,
};

export const fetchAllCourses = createAsyncThunk('admin/fetchCourses', async () => {
  const response = await api.get('/courses');
  return response.data;
});

export const createCourse = createAsyncThunk('admin/createCourse', async (courseData: Partial<Course>) => {
  const response = await api.post('/courses', courseData);
  return response.data;
});

export const updateCourse = createAsyncThunk('admin/updateCourse', async ({ id, data }: { id: string; data: Partial<Course> }) => {
  const response = await api.put(`/courses/${id}`, data);
  return response.data;
});

export const deleteCourse = createAsyncThunk('admin/deleteCourse', async (id: string) => {
  await api.delete(`/courses/${id}`);
  return id;
});

export const fetchEnrollments = createAsyncThunk('admin/fetchEnrollments', async () => {
  const response = await api.get('/enrollments');
  return response.data;
});

export const updateEnrollmentStatus = createAsyncThunk('admin/updateEnrollmentStatus', async ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => {
  const response = await api.put(`/enrollments/${id}/status`, { status });
  return response.data;
});

export const fetchAssignments = createAsyncThunk('admin/fetchAssignments', async () => {
  const response = await api.get('/assignments');
  return response.data;
});

export const gradeAssignment = createAsyncThunk('admin/gradeAssignment', async ({ assignmentId, studentId, grade, feedback }: { assignmentId: string; studentId: string; grade: number; feedback: string }) => {
  const response = await api.put('/assignments/grade', { assignmentId, studentId, grade, feedback });
  return response.data;
});

export const fetchAnalytics = createAsyncThunk('admin/fetchAnalytics', async () => {
  const response = await api.get('/analytics');
  return response.data;
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch courses';
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.courses.push(action.payload);
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.courses.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter(c => c._id !== action.payload);
      })
      .addCase(fetchEnrollments.fulfilled, (state, action) => {
        state.enrollments = action.payload;
      })
      .addCase(updateEnrollmentStatus.fulfilled, (state, action) => {
        const index = state.enrollments.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.enrollments[index] = action.payload;
        }
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.assignments = action.payload;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;