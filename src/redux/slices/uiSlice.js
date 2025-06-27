import { createSlice } from '@reduxjs/toolkit';

// Get theme from localStorage if available or default to 'light'
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  }
  return 'light';
};

const initialState = {
  theme: getInitialTheme(),
  isLoading: false,
  notification: {
    show: false,
    message: '',
    type: 'info', // 'success', 'error', 'warning', 'info'
  },
  sidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
        
        // Apply theme to document
        if (action.payload === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    showNotification: (state, action) => {
      state.notification = {
        show: true,
        message: action.payload.message,
        type: action.payload.type || 'info',
      };
    },
    hideNotification: (state) => {
      state.notification = {
        ...state.notification,
        show: false,
      };
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const { 
  setTheme, 
  setLoading, 
  showNotification, 
  hideNotification, 
  setSidebarOpen,
  toggleSidebar 
} = uiSlice.actions;

export default uiSlice.reducer; 