const Job = require('../models/Job');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../utils/errors');
const mongoose = require('mongoose');

/**
 * Create a new job
 */
const createJob = async (req, res) => {
  // Add user ID to job data
  req.body.createdBy = req.user.userId;
  
  // Create job
  const job = await Job.create(req.body);
  
  res.status(201).json({ job });
};

/**
 * Get all jobs with filtering, sorting, and pagination
 */
const getAllJobs = async (req, res) => {
  const { 
    search, status, jobType, sort, featured, 
    experience, location, page = 1, limit = 10 
  } = req.query;
  
  // Build query object
  const queryObject = {};
  
  // Add search filter
  if (search) {
    queryObject.$text = { $search: search };
  }
  
  // Add status filter
  if (status && status !== 'all') {
    queryObject.status = status;
  }
  
  // Add job type filter
  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }
  
  // Add featured filter
  if (featured === 'true') {
    queryObject.featured = true;
  }
  
  // Add experience filter
  if (experience && experience !== 'all') {
    queryObject.experience = experience;
  }
  
  // Add location filter
  if (location) {
    queryObject.location = { $regex: location, $options: 'i' };
  }
  
  // Calculate pagination
  const skip = (Number(page) - 1) * Number(limit);
  
  // Build sort object
  let sortOptions = {};
  
  if (sort === 'latest') {
    sortOptions = { createdAt: -1 };
  } else if (sort === 'oldest') {
    sortOptions = { createdAt: 1 };
  } else if (sort === 'a-z') {
    sortOptions = { title: 1 };
  } else if (sort === 'z-a') {
    sortOptions = { title: -1 };
  } else {
    // Default sort by latest
    sortOptions = { createdAt: -1 };
  }
  
  // Execute query
  const jobs = await Job.find(queryObject)
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit))
    .populate({
      path: 'createdBy',
      select: 'name email company profileImage'
    });
  
  // Get total count
  const totalJobs = await Job.countDocuments(queryObject);
  
  // Calculate number of pages
  const numOfPages = Math.ceil(totalJobs / Number(limit));
  
  res.status(200).json({
    jobs,
    totalJobs,
    numOfPages,
    currentPage: Number(page)
  });
};

/**
 * Get a single job by ID
 */
const getJob = async (req, res) => {
  const { id: jobId } = req.params;
  
  // Validate job ID
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw new BadRequestError('Invalid job ID');
  }
  
  // Find job
  const job = await Job.findById(jobId).populate({
    path: 'createdBy',
    select: 'name email company profileImage'
  });
  
  if (!job) {
    throw new NotFoundError(`No job found with id: ${jobId}`);
  }
  
  res.status(200).json({ job });
};

/**
 * Update a job
 */
const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  
  // Validate job ID
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw new BadRequestError('Invalid job ID');
  }
  
  // Find job
  const job = await Job.findById(jobId);
  
  if (!job) {
    throw new NotFoundError(`No job found with id: ${jobId}`);
  }
  
  // Check if user is the job creator or an admin
  if (job.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
    throw new ForbiddenError('You are not authorized to update this job');
  }
  
  // Update job
  const updatedJob = await Job.findByIdAndUpdate(
    jobId,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.status(200).json({ job: updatedJob });
};

/**
 * Delete a job
 */
const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;
  
  // Validate job ID
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw new BadRequestError('Invalid job ID');
  }
  
  // Find job
  const job = await Job.findById(jobId);
  
  if (!job) {
    throw new NotFoundError(`No job found with id: ${jobId}`);
  }
  
  // Check if user is the job creator or an admin
  if (job.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
    throw new ForbiddenError('You are not authorized to delete this job');
  }
  
  // Delete job
  await job.deleteOne();
  
  res.status(200).json({ message: 'Job deleted successfully' });
};

/**
 * Get jobs created by the current user
 */
const getMyJobs = async (req, res) => {
  const { 
    status, jobType, sort, 
    page = 1, limit = 10 
  } = req.query;
  
  // Build query object
  const queryObject = {
    createdBy: req.user.userId
  };
  
  // Add status filter
  if (status && status !== 'all') {
    queryObject.status = status;
  }
  
  // Add job type filter
  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }
  
  // Calculate pagination
  const skip = (Number(page) - 1) * Number(limit);
  
  // Build sort object
  let sortOptions = {};
  
  if (sort === 'latest') {
    sortOptions = { createdAt: -1 };
  } else if (sort === 'oldest') {
    sortOptions = { createdAt: 1 };
  } else if (sort === 'a-z') {
    sortOptions = { title: 1 };
  } else if (sort === 'z-a') {
    sortOptions = { title: -1 };
  } else {
    // Default sort by latest
    sortOptions = { createdAt: -1 };
  }
  
  // Execute query
  const jobs = await Job.find(queryObject)
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit));
  
  // Get total count
  const totalJobs = await Job.countDocuments(queryObject);
  
  // Calculate number of pages
  const numOfPages = Math.ceil(totalJobs / Number(limit));
  
  // Get job stats
  const stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  
  // Format stats
  const statsObject = {
    open: 0,
    interview: 0,
    closed: 0
  };
  
  stats.forEach(stat => {
    statsObject[stat._id] = stat.count;
  });
  
  res.status(200).json({
    jobs,
    totalJobs,
    numOfPages,
    currentPage: Number(page),
    stats: statsObject
  });
};

/**
 * Update job status
 */
const updateJobStatus = async (req, res) => {
  const { id: jobId } = req.params;
  const { status } = req.body;
  
  if (!status || !['open', 'interview', 'closed'].includes(status)) {
    throw new BadRequestError('Please provide a valid status');
  }
  
  // Validate job ID
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw new BadRequestError('Invalid job ID');
  }
  
  // Find job
  const job = await Job.findById(jobId);
  
  if (!job) {
    throw new NotFoundError(`No job found with id: ${jobId}`);
  }
  
  // Check if user is the job creator or an admin
  if (job.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
    throw new ForbiddenError('You are not authorized to update this job');
  }
  
  // Update job status
  job.status = status;
  await job.save();
  
  res.status(200).json({ job });
};

/**
 * Get job stats
 */
const getJobStats = async (req, res) => {
  // Get job stats by status
  const statusStats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  
  // Get job stats by type
  const typeStats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$jobType', count: { $sum: 1 } } }
  ]);
  
  // Format status stats
  const statusObject = {
    open: 0,
    interview: 0,
    closed: 0
  };
  
  statusStats.forEach(stat => {
    statusObject[stat._id] = stat.count;
  });
  
  // Format type stats
  const typeObject = {
    'full-time': 0,
    'part-time': 0,
    remote: 0,
    internship: 0,
    contract: 0
  };
  
  typeStats.forEach(stat => {
    typeObject[stat._id] = stat.count;
  });
  
  res.status(200).json({
    statusStats: statusObject,
    typeStats: typeObject,
    totalJobs: Object.values(statusObject).reduce((acc, curr) => acc + curr, 0)
  });
};

module.exports = {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
  getMyJobs,
  updateJobStatus,
  getJobStats
}; 