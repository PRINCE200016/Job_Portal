import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaBuilding, FaMapMarkerAlt, FaDollarSign, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import { createJob, getJobById, updateJob } from '../redux/slices/jobSlice';
import { showNotification } from '../redux/slices/uiSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PostJob = () => {
  const { id } = useParams(); // For editing existing job
  const isEditMode = !!id;
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { job, isLoading } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    requirements: '',
    deadline: '',
  });
  
  const [errors, setErrors] = useState({});
  
  // Load job data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      dispatch(getJobById(id));
    }
  }, [dispatch, id, isEditMode]);
  
  // Populate form with job data when loaded
  useEffect(() => {
    if (isEditMode && job) {
      setFormData({
        title: job.title || '',
        company: job.company || '',
        location: job.location || '',
        type: job.type || 'Full-time',
        salary: job.salary || '',
        description: job.description || '',
        requirements: job.requirements || '',
        deadline: job.deadline || '',
      });
    }
  }, [isEditMode, job]);
  
  // Check if user is a recruiter
  if (user && user.role !== 'recruiter') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-md">
          You do not have permission to access this page.
        </div>
      </div>
    );
  }
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = ['title', 'company', 'location', 'type', 'description'];
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    
    // Salary validation (optional but if provided should be in valid format)
    if (formData.salary && !/^\$?[\d,]+(\s*-\s*\$?[\d,]+)?$/.test(formData.salary)) {
      newErrors.salary = 'Please enter a valid salary format (e.g. $50,000 or $50,000 - $70,000)';
    }
    
    // Deadline validation (optional but if provided should be in the future)
    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        newErrors.deadline = 'Deadline cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (isEditMode) {
        dispatch(updateJob({ id, jobData: formData }));
      } else {
        dispatch(createJob(formData));
      }
      
      dispatch(showNotification({
        message: isEditMode ? 'Job updated successfully!' : 'Job posted successfully!',
        type: 'success',
      }));
      
      navigate('/dashboard');
    }
  };
  
  if (isLoading && isEditMode) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        {isEditMode ? 'Edit Job' : 'Post a New Job'}
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Job Title */}
            <div>
              <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Job Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g. Frontend Developer"
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>
            
            {/* Company */}
            <div>
              <label htmlFor="company" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Company*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaBuilding className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.company ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Your company name"
                />
              </div>
              {errors.company && <p className="mt-1 text-sm text-red-500">{errors.company}</p>}
            </div>
            
            {/* Location */}
            <div>
              <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Location*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaMapMarkerAlt className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g. New York, NY or Remote"
                />
              </div>
              {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
            </div>
            
            {/* Job Type */}
            <div>
              <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Job Type*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaBriefcase className="text-gray-400" />
                </div>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.type ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
              {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
            </div>
            
            {/* Salary */}
            <div>
              <label htmlFor="salary" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Salary (optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaDollarSign className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.salary ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g. $50,000 - $70,000"
                />
              </div>
              {errors.salary && <p className="mt-1 text-sm text-red-500">{errors.salary}</p>}
            </div>
            
            {/* Application Deadline */}
            <div>
              <label htmlFor="deadline" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Application Deadline (optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.deadline ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.deadline && <p className="mt-1 text-sm text-red-500">{errors.deadline}</p>}
            </div>
          </div>
          
          {/* Job Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Job Description*
            </label>
            <textarea
              id="description"
              name="description"
              rows="6"
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Provide a detailed description of the job..."
            ></textarea>
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>
          
          {/* Requirements */}
          <div className="mb-6">
            <label htmlFor="requirements" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Requirements (comma separated)
            </label>
            <textarea
              id="requirements"
              name="requirements"
              rows="3"
              value={formData.requirements}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g. React, JavaScript, 3+ years experience"
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mr-4 px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : isEditMode ? 'Update Job' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob; 