import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Import slices
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import jobReducer from './slices/jobSlice';
import applicationReducer from './slices/applicationSlice';

// Configure the store
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    jobs: jobReducer,
    applications: applicationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch); 