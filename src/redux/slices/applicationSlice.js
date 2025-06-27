import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Mock data for development
const mockApplications = [
  {
    id: '1',
    jobId: '1',
    userId: '123',
    resume: 'resume-url-1.pdf',
    coverLetter: 'I am interested in this position...',
    status: 'pending',
    appliedDate: '2023-06-15',
    jobTitle: 'Frontend Developer',
    company: 'Tech Solutions Inc',
  },
  {
    id: '2',
    jobId: '2',
    userId: '123',
    resume: 'resume-url-2.pdf',
    coverLetter: 'I believe I am a good fit for this role...',
    status: 'rejected',
    appliedDate: '2023-06-10',
    jobTitle: 'Backend Developer',
    company: 'Data Systems LLC',
  },
  {
    id: '3',
    jobId: '3',
    userId: '456',
    resume: 'resume-url-3.pdf',
    coverLetter: 'I have experience in UX design...',
    status: 'accepted',
    appliedDate: '2023-06-12',
    jobTitle: 'UX Designer',
    company: 'Creative Minds',
  },
];

const initialState = {
  applications: [],
  application: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  stats: {
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  },
};

// API URL - will be replaced with environment variable in production
const API_URL = '/api/v1/applications';

// Get user applications
export const getUserApplications = createAsyncThunk(
  'applications/getUserApplications',
  async (_, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user;
      
      // For development, filter mock data
      const userApplications = mockApplications.filter(app => app.userId === user.id);
      return userApplications;
      
      // In production, use the actual API
      // const response = await axios.get(`${API_URL}/user`, {
      //   headers: {
      //     Authorization: `Bearer ${user.token}`,
      //   },
      // });
      // return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get job applications (for recruiters)
export const getJobApplications = createAsyncThunk(
  'applications/getJobApplications',
  async (jobId, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user;
      
      // For development, filter mock data
      const jobApplications = mockApplications.filter(app => app.jobId === jobId);
      return jobApplications;
      
      // In production, use the actual API
      // const response = await axios.get(`${API_URL}/job/${jobId}`, {
      //   headers: {
      //     Authorization: `Bearer ${user.token}`,
      //   },
      // });
      // return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Apply for job
export const applyForJob = createAsyncThunk(
  'applications/apply',
  async (applicationData, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user;
      
      // For development, simulate applying for a job
      const newApplication = {
        ...applicationData,
        id: Date.now().toString(),
        userId: user.id,
        status: 'pending',
        appliedDate: new Date().toISOString().split('T')[0],
      };
      
      return newApplication;
      
      // In production, use the actual API
      // const response = await axios.post(API_URL, applicationData, {
      //   headers: {
      //     Authorization: `Bearer ${user.token}`,
      //   },
      // });
      // return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update application status (for recruiters)
export const updateApplicationStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user;
      
      // For development, simulate updating status
      const updatedApplication = {
        id,
        status,
      };
      
      return updatedApplication;
      
      // In production, use the actual API
      // const response = await axios.patch(`${API_URL}/${id}/status`, { status }, {
      //   headers: {
      //     Authorization: `Bearer ${user.token}`,
      //   },
      // });
      // return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearApplication: (state) => {
      state.application = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserApplications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.applications = action.payload;
        // Calculate stats
        state.stats = {
          total: action.payload.length,
          pending: action.payload.filter(app => app.status === 'pending').length,
          accepted: action.payload.filter(app => app.status === 'accepted').length,
          rejected: action.payload.filter(app => app.status === 'rejected').length,
        };
      })
      .addCase(getUserApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getJobApplications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getJobApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.applications = action.payload;
      })
      .addCase(getJobApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(applyForJob.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.applications.push(action.payload);
        state.application = action.payload;
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateApplicationStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.applications = state.applications.map((app) =>
          app.id === action.payload.id
            ? { ...app, status: action.payload.status }
            : app
        );
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearApplication } = applicationSlice.actions;
export default applicationSlice.reducer; 