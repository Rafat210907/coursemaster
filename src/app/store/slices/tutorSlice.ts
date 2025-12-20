import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import { Tutor } from '@/types';

interface TutorState {
  tutors: Tutor[];
  currentTutor: Tutor | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

const initialState: TutorState = {
  tutors: [],
  currentTutor: null,
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
};

export const fetchTutors = createAsyncThunk(
  'tutors/fetchTutors',
  async (params: { page?: number; limit?: number; search?: string; expertise?: string; activeOnly?: string }) => {
    const response = await api.get('/tutors', { params });
    return response.data;
  }
);

export const fetchTutor = createAsyncThunk('tutors/fetchTutor', async (id: string) => {
  const response = await api.get(`/tutors/${id}`);
  return response.data;
});

export const createTutor = createAsyncThunk('tutors/createTutor', async (tutorData: Omit<Tutor, '_id' | 'courses' | 'createdAt'>, { rejectWithValue }) => {
  try {
    const response = await api.post('/tutors', tutorData);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || err.response?.data?.message || 'Failed to create tutor');
  }
});

export const updateTutor = createAsyncThunk('tutors/updateTutor', async ({ id, tutorData }: { id: string; tutorData: Partial<Tutor> }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/tutors/${id}`, tutorData);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || err.response?.data?.message || 'Failed to update tutor');
  }
});

export const deleteTutor = createAsyncThunk('tutors/deleteTutor', async (id: string, { rejectWithValue }) => {
  try {
    await api.delete(`/tutors/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || err.response?.data?.message || 'Failed to delete tutor');
  }
});

export const fetchTutorStats = createAsyncThunk('tutors/fetchTutorStats', async (id: string) => {
  const response = await api.get(`/tutors/${id}/stats`);
  return response.data;
});

const tutorSlice = createSlice({
  name: 'tutors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTutors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTutors.fulfilled, (state, action) => {
        state.loading = false;
        state.tutors = action.payload.tutors;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchTutors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tutors';
      })
      .addCase(fetchTutor.fulfilled, (state, action) => {
        state.currentTutor = action.payload;
      })
      .addCase(createTutor.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTutor.fulfilled, (state, action) => {
        state.loading = false;
        state.tutors.push(action.payload);
      })
      .addCase(createTutor.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || 'Failed to create tutor';
      })
      .addCase(updateTutor.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTutor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tutors.findIndex(tutor => tutor._id === action.payload._id);
        if (index !== -1) {
          state.tutors[index] = action.payload;
        }
      })
      .addCase(updateTutor.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || 'Failed to update tutor';
      })
      .addCase(deleteTutor.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTutor.fulfilled, (state, action) => {
        state.loading = false;
        state.tutors = state.tutors.filter(tutor => tutor._id !== action.payload);
      })
      .addCase(deleteTutor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete tutor';
      });
  },
});

export default tutorSlice.reducer;