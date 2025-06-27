import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Sample job data for development
const sampleJobs = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'Tech Solutions Inc.',
    location: 'New York, NY',
    salary: '$80,000 - $100,000',
    type: 'Full-time',
    description: 'We are looking for a skilled Frontend Developer to join our team...',
    requirements: 'React, JavaScript, CSS, HTML5',
    postedBy: 'recruiter123',
    postedDate: '2023-06-15',
    deadline: '2023-07-15',
  },
  {
    id: '2',
    title: 'Backend Engineer',
    company: 'Data Systems LLC',
    location: 'Remote',
    salary: '$90,000 - $120,000',
    type: 'Full-time',
    description: 'Join our backend team to develop robust APIs and services...',
    requirements: 'Node.js, Express, MongoDB, AWS',
    postedBy: 'recruiter456',
    postedDate: '2023-06-10',
    deadline: '2023-07-10',
  },
  {
    id: '3',
    title: 'UX/UI Designer',
    company: 'Creative Designs Co.',
    location: 'San Francisco, CA',
    salary: '$75,000 - $95,000',
    type: 'Full-time',
    description: 'Design beautiful and intuitive user interfaces for our products...',
    requirements: 'Figma, Adobe XD, UI/UX principles',
    postedBy: 'recruiter789',
    postedDate: '2023-06-12',
    deadline: '2023-07-12',
  },
];

const initialState = {
  jobs: [],
  job: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  filters: {
    search: '',
    location: '',
    type: '',
    sortBy: 'newest',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    limit: 10,
  },
};

// API URL - will be replaced with environment variable in production
const API_URL = '/api/v1/jobs';

// Get all jobs
export const getJobs = createAsyncThunk(
  'jobs/getAll',
  async (_, thunkAPI) => {
    try {
      // For development, return sample data
      return {
        jobs: sampleJobs,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalJobs: sampleJobs.length,
          limit: 10,
        },
      };
      
      // In production, this would be an API call:
      // const response = await axios.get(API_URL);
      // return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Failed to fetch jobs';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get job by ID
export const getJobById = createAsyncThunk(
  'jobs/getById',
  async (id, thunkAPI) => {
    try {
      // For development, find job in sample data
      const job = sampleJobs.find(job => job.id === id);
      
      if (!job) {
        return thunkAPI.rejectWithValue('Job not found');
      }
      
      return job;
      
      // In production, this would be an API call:
      // const response = await axios.get(`${API_URL}/${id}`);
      // return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Failed to fetch job';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new job
export const createJob = createAsyncThunk(
  'jobs/create',
  async (jobData, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user;
      
      if (!user || user.role !== 'recruiter') {
        return thunkAPI.rejectWithValue('Not authorized to create jobs');
      }
      
      // For development, simulate creating a job
      const newJob = {
        id: Date.now().toString(),
        ...jobData,
        postedBy: user.id,
        postedDate: new Date().toISOString().split('T')[0],
      };
      
      // In production, this would be an API call:
      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${user.token}`,
      //   },
      // };
      // const response = await axios.post(API_URL, jobData, config);
      // return response.data;
      
      return newJob;
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Failed to create job';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update job
export const updateJob = createAsyncThunk(
  'jobs/update',
  async ({ id, jobData }, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user;
      
      if (!user || user.role !== 'recruiter') {
        return thunkAPI.rejectWithValue('Not authorized to update jobs');
      }
      
      // For development, simulate updating a job
      const updatedJob = {
        id,
        ...jobData,
        postedBy: user.id,
      };
      
      // In production, this would be an API call:
      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${user.token}`,
      //   },
      // };
      // const response = await axios.put(`${API_URL}/${id}`, jobData, config);
      // return response.data;
      
      return updatedJob;
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Failed to update job';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete job
export const deleteJob = createAsyncThunk(
  'jobs/delete',
  async (id, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user;
      
      if (!user || user.role !== 'recruiter') {
        return thunkAPI.rejectWithValue('Not authorized to delete jobs');
      }
      
      // In production, this would be an API call:
      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${user.token}`,
      //   },
      // };
      // await axios.delete(`${API_URL}/${id}`, config);
      
      return id;
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Failed to delete job';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    clearJob: (state) => {
      state.job = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all jobs
      .addCase(getJobs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.jobs = action.payload.jobs;
        state.pagination = action.payload.pagination;
      })
      .addCase(getJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get job by ID
      .addCase(getJobById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getJobById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.job = action.payload;
      })
      .addCase(getJobById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create job
      .addCase(createJob.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.jobs.push(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update job
      .addCase(updateJob.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.jobs = state.jobs.map((job) =>
          job.id === action.payload.id ? action.payload : job
        );
        state.job = action.payload;
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete job
      .addCase(deleteJob.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, setFilters, setPage, clearJob } = jobSlice.actions;
export default jobSlice.reducer;