const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { BadRequestError, NotFoundError, ForbiddenError, ConflictError } = require('../utils/errors');
const mongoose = require('mongoose');
const { uploadFile, deleteFile } = require('../utils/cloudinary');
const { sendApplicationConfirmationEmail } = require('../utils/email');

/**
 * Create a new application
 */
const createApplication = async (req, res) => {
  const { jobId, coverLetter } = req.body;
  const userId = req.user.userId;
  
  // Check if job ID is provided
  if (!jobId) {
    throw new BadRequestError('Please provide a job ID');
  }
  
  // Check if job exists
  const job = await Job.findById(jobId);
  if (!job) {
    throw new NotFoundError(`No job found with id: ${jobId}`);
  }
  
  // Check if job is still open
  if (job.status !== 'open') {
    throw new BadRequestError('This job is no longer accepting applications');
  }
  
  // Check if application deadline has passed
  if (job.applicationDeadline && new Date(job.applicationDeadline) < new Date()) {
    throw new BadRequestError('The application deadline for this job has passed');
  }
  
  // Check if user has already applied for this job
  const existingApplication = await Application.findOne({
    job: jobId,
    applicant: userId
  });
  
  if (existingApplication) {
    throw new ConflictError('You have already applied for this job');
  }
  
  // Check if resume is uploaded
  if (!req.file) {
    throw new BadRequestError('Please upload your resume');
  }
  
  // Upload resume to Cloudinary
  const result = await uploadFile(req.file.path, 'jobify/resumes');
  
  // Create application
  const application = await Application.create({
    job: jobId,
    applicant: userId,
    coverLetter,
    resume: {
      url: result.secure_url,
      name: req.file.originalname,
      publicId: result.public_id
    }
  });
  
  // Get user and job details for email
  const user = await User.findById(userId);
  
  // Send confirmation email
  try {
    await sendApplicationConfirmationEmail(
      user.name,
      user.email,
      job.title,
      job.company
    );
  } catch (error) {
    console.log('Error sending application confirmation email', error);
  }
  
  res.status(201).json({ application });
};

/**
 * Get all applications for a job (for recruiters)
 */
const getJobApplications = async (req, res) => {
  const { jobId } = req.params;
  const { status, sort, page = 1, limit = 10 } = req.query;
  
  // Check if job exists
  const job = await Job.findById(jobId);
  if (!job) {
    throw new NotFoundError(`No job found with id: ${jobId}`);
  }
  
  // Check if user is authorized (job creator or admin)
  if (job.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
    throw new ForbiddenError('You are not authorized to view these applications');
  }
  
  // Build query object
  const queryObject = { job: jobId };
  
  // Add status filter
  if (status && status !== 'all') {
    queryObject.status = status;
  }
  
  // Calculate pagination
  const skip = (Number(page) - 1) * Number(limit);
  
  // Build sort object
  let sortOptions = {};
  
  if (sort === 'latest') {
    sortOptions = { createdAt: -1 };
  } else if (sort === 'oldest') {
    sortOptions = { createdAt: 1 };
  } else {
    // Default sort by latest
    sortOptions = { createdAt: -1 };
  }
  
  // Execute query
  const applications = await Application.find(queryObject)
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit))
    .populate({
      path: 'applicant',
      select: 'name email location profileImage'
    });
  
  // Get total count
  const totalApplications = await Application.countDocuments(queryObject);
  
  // Calculate number of pages
  const numOfPages = Math.ceil(totalApplications / Number(limit));
  
  // Get application stats
  const stats = await Application.aggregate([
    { $match: { job: new mongoose.Types.ObjectId(jobId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  
  // Format stats
  const statsObject = {
    pending: 0,
    reviewed: 0,
    interview: 0,
    rejected: 0,
    accepted: 0
  };
  
  stats.forEach(stat => {
    statsObject[stat._id] = stat.count;
  });
  
  res.status(200).json({
    applications,
    totalApplications,
    numOfPages,
    currentPage: Number(page),
    stats: statsObject
  });
};

/**
 * Get all applications by the current user (job seeker)
 */
const getMyApplications = async (req, res) => {
  const { status, sort, page = 1, limit = 10 } = req.query;
  const userId = req.user.userId;
  
  // Build query object
  const queryObject = { applicant: userId };
  
  // Add status filter
  if (status && status !== 'all') {
    queryObject.status = status;
  }
  
  // Calculate pagination
  const skip = (Number(page) - 1) * Number(limit);
  
  // Build sort object
  let sortOptions = {};
  
  if (sort === 'latest') {
    sortOptions = { createdAt: -1 };
  } else if (sort === 'oldest') {
    sortOptions = { createdAt: 1 };
  } else {
    // Default sort by latest
    sortOptions = { createdAt: -1 };
  }
  
  // Execute query
  const applications = await Application.find(queryObject)
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit))
    .populate({
      path: 'job',
      select: 'title company location status'
    });
  
  // Get total count
  const totalApplications = await Application.countDocuments(queryObject);
  
  // Calculate number of pages
  const numOfPages = Math.ceil(totalApplications / Number(limit));
  
  // Get application stats
  const stats = await Application.getStatusCounts(userId);
  
  // Format stats
  const statsObject = {
    pending: 0,
    reviewed: 0,
    interview: 0,
    rejected: 0,
    accepted: 0
  };
  
  stats.forEach(stat => {
    statsObject[stat._id] = stat.count;
  });
  
  res.status(200).json({
    applications,
    totalApplications,
    numOfPages,
    currentPage: Number(page),
    stats: statsObject
  });
};

/**
 * Get a single application by ID
 */
const getApplication = async (req, res) => {
  const { id: applicationId } = req.params;
  
  // Validate application ID
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new BadRequestError('Invalid application ID');
  }
  
  // Find application
  const application = await Application.findById(applicationId)
    .populate({
      path: 'applicant',
      select: 'name email location profileImage skills bio resumeUrl phoneNumber socialLinks'
    })
    .populate({
      path: 'job',
      select: 'title company location jobType description requirements'
    });
  
  if (!application) {
    throw new NotFoundError(`No application found with id: ${applicationId}`);
  }
  
  // Check if user is authorized (application owner, job creator, or admin)
  const job = await Job.findById(application.job._id);
  
  if (
    application.applicant._id.toString() !== req.user.userId && 
    job.createdBy.toString() !== req.user.userId && 
    req.user.role !== 'admin'
  ) {
    throw new ForbiddenError('You are not authorized to view this application');
  }
  
  res.status(200).json({ application });
};

/**
 * Update application status (for recruiters)
 */
const updateApplicationStatus = async (req, res) => {
  const { id: applicationId } = req.params;
  const { status, notes, rejectionReason, interviewDate, interviewLocation } = req.body;
  
  if (!status) {
    throw new BadRequestError('Please provide a status');
  }
  
  // Validate application ID
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new BadRequestError('Invalid application ID');
  }
  
  // Find application
  const application = await Application.findById(applicationId);
  
  if (!application) {
    throw new NotFoundError(`No application found with id: ${applicationId}`);
  }
  
  // Find job
  const job = await Job.findById(application.job);
  
  // Check if user is authorized (job creator or admin)
  if (job.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
    throw new ForbiddenError('You are not authorized to update this application');
  }
  
  // Update application
  application.status = status;
  
  if (notes) {
    application.notes = notes;
  }
  
  if (status === 'rejected' && rejectionReason) {
    application.rejectionReason = rejectionReason;
  }
  
  if (status === 'interview') {
    if (interviewDate) {
      application.interviewDate = interviewDate;
    }
    
    if (interviewLocation) {
      application.interviewLocation = interviewLocation;
    }
  }
  
  await application.save();
  
  res.status(200).json({ application });
};

/**
 * Delete an application (for job seekers)
 */
const deleteApplication = async (req, res) => {
  const { id: applicationId } = req.params;
  
  // Validate application ID
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new BadRequestError('Invalid application ID');
  }
  
  // Find application
  const application = await Application.findById(applicationId);
  
  if (!application) {
    throw new NotFoundError(`No application found with id: ${applicationId}`);
  }
  
  // Check if user is authorized (application owner or admin)
  if (application.applicant.toString() !== req.user.userId && req.user.role !== 'admin') {
    throw new ForbiddenError('You are not authorized to delete this application');
  }
  
  // Delete resume from Cloudinary
  if (application.resume && application.resume.publicId) {
    try {
      await deleteFile(application.resume.publicId);
    } catch (error) {
      console.log('Error deleting resume from Cloudinary', error);
    }
  }
  
  // Delete additional documents from Cloudinary
  if (application.additionalDocuments && application.additionalDocuments.length > 0) {
    for (const doc of application.additionalDocuments) {
      if (doc.publicId) {
        try {
          await deleteFile(doc.publicId);
        } catch (error) {
          console.log('Error deleting document from Cloudinary', error);
        }
      }
    }
  }
  
  // Delete application
  await application.deleteOne();
  
  res.status(200).json({ message: 'Application deleted successfully' });
};

module.exports = {
  createApplication,
  getJobApplications,
  getMyApplications,
  getApplication,
  updateApplicationStatus,
  deleteApplication
}; 