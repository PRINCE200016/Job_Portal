import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get user from localStorage
const user = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;

const initialState = {
  user: user,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// API URL - will be replaced with environment variable in production
const API_URL = '/api/v1/auth';

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      // For development, simulate a successful registration
      const mockUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role || 'jobseeker',
        token: 'mock-jwt-token',
      };
      
      // In production, this would be an API call:
      // const response = await axios.post(`${API_URL}/register`, userData);
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return mockUser;
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Registration failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      // For development, simulate a successful login
      const mockUser = {
        id: '123',
        name: 'Test User',
        email: userData.email,
        role: 'jobseeker',
        token: 'mock-jwt-token',
      };
      
      // In production, this would be an API call:
      // const response = await axios.post(`${API_URL}/login`, userData);
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return mockUser;
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Login failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // Logout case
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer; 