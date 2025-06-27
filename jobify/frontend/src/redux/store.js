import { configureStore } from '@reduxjs/toolkit';

// We're creating a simple store for now, we'll add reducers later
export const store = configureStore({
  reducer: {
    // We'll add these reducers as we create them
    // auth: authReducer,
    // ui: uiReducer,
    // jobs: jobReducer,
    // applications: applicationReducer,
  },
});
