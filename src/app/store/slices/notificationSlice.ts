import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../lib/axios';
import { Notification } from '../../../types';

interface NotificationState {
    notifications: Notification[];
    loading: boolean;
    error: string | null;
    unreadCount: number;
}

const initialState: NotificationState = {
    notifications: [],
    loading: false,
    error: null,
    unreadCount: 0,
};

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/notices/notifications');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
        }
    }
);

export const markRead = createAsyncThunk(
    'notifications/markRead',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.put(`/notices/notifications/${id}/read`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read');
        }
    }
);

export const markReadByNoticeId = createAsyncThunk(
    'notifications/markReadByNoticeId',
    async (noticeId: string, { rejectWithValue }) => {
        try {
            await api.put(`/notices/notifications/reference/${noticeId}/read`);
            return noticeId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark notifications as read');
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
                state.unreadCount = action.payload.filter((n: Notification) => !n.isRead).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(markRead.fulfilled, (state, action) => {
                const index = state.notifications.findIndex(n => n._id === action.payload._id);
                if (index !== -1) {
                    state.notifications[index] = action.payload;
                }
                state.unreadCount = state.notifications.filter(n => !n.isRead).length;
            })
            .addCase(markReadByNoticeId.fulfilled, (state, action) => {
                state.notifications = state.notifications.map(n =>
                    n.referenceId === action.payload ? { ...n, isRead: true } : n
                );
                state.unreadCount = state.notifications.filter(n => !n.isRead).length;
            });
    },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
