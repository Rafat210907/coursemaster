'use client';

import { Provider } from 'react-redux';
import { store } from './store/store';
import { useEffect } from 'react';
import { getProfile, setToken } from './store/slices/authSlice';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      store.dispatch(setToken(token));
      store.dispatch(getProfile());
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}