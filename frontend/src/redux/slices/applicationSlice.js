import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Sample applications data for development
const sampleApplications = [
  {
    id: '1',
    jobId: '1',
    userId: '123',
    status: 'Applied',
    resumeUrl: 'https://example.com/resume1.pdf',
    coverLetter: 'I am excited to apply for this position...',
    appliedDate: '2023-06-20',
  },
  {
    id: '2',
    jobId: '2',
    userId: '123',
    status: 'Under Review',
    resumeUrl: 'https://example.com/resume1.pdf',
    coverLetter: 'I believe my skills match perfectly with...',
    appliedDate: '2023-06-18',
  },
];

const initialState = {
  applications: [],
  application: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// API URL - will be replaced with environment variable in production
const API_URL = '/api/v1/applications';

// Get user applications
export const getUserApplications = createAsyncThunk(
  'applications/getUserApplications',
  async (_, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user;
      
      if (!user) {
        return thunkAPI.rejectWithValue('Not authorized');
      }
      
      // For development, return sample data
      return sampleApplications.filter(app => app.userId === user.id);
      
      // In production, this would be an API call:
      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${user.token}`,
      //   },
      // };
      // const response = await axios.get(`${API_URL}/user`, config);
      // return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Failed to fetch applications';
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
      
      if (!user || user.role !== 'recruiter') {
        return thunkAPI.rejectWithValue('Not authorized');
      }
      
      // For development, return sample data
      return sampleApplications.filter(app => app.jobId === jobId);
      
      // In production, this would be an API call:
      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${user.token}`,
      //   },
      // };
      // const response = await axios.get(`${API_URL}/job/${jobId}`, config);
      // return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Failed to fetch applications';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Apply for a job
export const applyForJob = createAsyncThunk(
  'applications/apply',
  async (applicationData, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user;
      
      if (!user || user.role !== 'jobseeker') {
        return thunkAPI.rejectWithValue('Not authorized');
      }
      
      // For development, simulate creating an application
      const newApplication = {
        id: Date.now().toString(),
        userId: user.id,
        status: 'Applied',
        appliedDate: new Date().toISOString().split('T')[0],
        ...applicationData,
      };
      
      // In production, this would be an API call:
      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${user.token}`,
      //     'Content-Type': 'multipart/form-data',
      //   },
      // };
      // const formData = new FormData();
      // for (const key in applicationData) {
      //   formData.append(key, applicationData[key]);
      // }
      // const response = await axios.post(API_URL, formData, config);
      // return response.data;
      
      return newApplication;
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Failed to apply for job';
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
      
      if (!user || user.role !== 'recruiter') {
        return thunkAPI.rejectWithValue('Not authorized');
      }
      
      // For development, simulate updating an application
      const updatedApplication = { id, status };
      
      // In production, this would be an API call:
      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${user.token}`,
      //   },
      // };
      // const response = await axios.patch(`${API_URL}/${id}/status`, { status }, config);
      // return response.data;
      
      return updatedApplication;
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Failed to update application status';
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
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearApplication: (state) => {
      state.application = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user applications
      .addCase(getUserApplications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.applications = action.payload;
      })
      .addCase(getUserApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get job applications
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
      // Apply for job
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
      // Update application status
      .addCase(updateApplicationStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.applications = state.applications.map((app) =>
          app.id === action.payload.id ? { ...app, status: action.payload.status } : app
        );
        if (state.application && state.application.id === action.payload.id) {
          state.application.status = action.payload.status;
        }
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