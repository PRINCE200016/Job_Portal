const User = require('../models/User');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../utils/errors');
const { uploadFile, deleteFile } = require('../utils/cloudinary');
const mongoose = require('mongoose');

/**
 * Get current user profile
 */
const getCurrentUser = async (req, res) => {
  const userId = req.user.userId;
  
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  res.status(200).json({ user });
};

/**
 * Update current user profile
 */
const updateProfile = async (req, res) => {
  const userId = req.user.userId;
  const {
    name,
    location,
    bio,
    skills,
    phoneNumber,
    company,
    jobTitle,
    socialLinks
  } = req.body;
  
  // Find user
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  // Update user fields
  if (name) user.name = name;
  if (location) user.location = location;
  if (bio) user.bio = bio;
  if (skills) user.skills = skills;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  if (company) user.company = company;
  if (jobTitle) user.jobTitle = jobTitle;
  if (socialLinks) user.socialLinks = { ...user.socialLinks, ...socialLinks };
  
  await user.save();
  
  res.status(200).json({ user });
};

/**
 * Upload profile image
 */
const uploadProfileImage = async (req, res) => {
  const userId = req.user.userId;
  
  // Check if image is uploaded
  if (!req.file) {
    throw new BadRequestError('Please upload an image');
  }
  
  // Find user
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  // Delete old profile image if it exists
  if (user.profileImage && user.profileImage.includes('cloudinary')) {
    try {
      // Extract public ID from Cloudinary URL
      const publicId = user.profileImage.split('/').slice(-1)[0].split('.')[0];
      await deleteFile(`jobify/profile-images/${publicId}`);
    } catch (error) {
      console.log('Error deleting old profile image', error);
    }
  }
  
  // Upload new profile image
  const result = await uploadFile(req.file.path, 'jobify/profile-images');
  
  // Update user profile image
  user.profileImage = result.secure_url;
  await user.save();
  
  res.status(200).json({
    user: {
      profileImage: user.profileImage
    }
  });
};

/**
 * Upload resume
 */
const uploadResume = async (req, res) => {
  const userId = req.user.userId;
  
  // Check if resume is uploaded
  if (!req.file) {
    throw new BadRequestError('Please upload a resume');
  }
  
  // Find user
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  // Delete old resume if it exists
  if (user.resumeUrl && user.resumeUrl.includes('cloudinary')) {
    try {
      // Extract public ID from Cloudinary URL
      const publicId = user.resumeUrl.split('/').slice(-1)[0].split('.')[0];
      await deleteFile(`jobify/resumes/${publicId}`);
    } catch (error) {
      console.log('Error deleting old resume', error);
    }
  }
  
  // Upload new resume
  const result = await uploadFile(req.file.path, 'jobify/resumes');
  
  // Update user resume URL
  user.resumeUrl = result.secure_url;
  await user.save();
  
  res.status(200).json({
    user: {
      resumeUrl: user.resumeUrl
    }
  });
};

/**
 * Get all users (admin only)
 */
const getAllUsers = async (req, res) => {
  const { role, search, sort, page = 1, limit = 10 } = req.query;
  
  // Build query object
  const queryObject = {};
  
  // Add role filter
  if (role && role !== 'all') {
    queryObject.role = role;
  }
  
  // Add search filter
  if (search) {
    queryObject.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } }
    ];
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
    sortOptions = { name: 1 };
  } else if (sort === 'z-a') {
    sortOptions = { name: -1 };
  } else {
    // Default sort by latest
    sortOptions = { createdAt: -1 };
  }
  
  // Execute query
  const users = await User.find(queryObject)
    .select('-password')
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit));
  
  // Get total count
  const totalUsers = await User.countDocuments(queryObject);
  
  // Calculate number of pages
  const numOfPages = Math.ceil(totalUsers / Number(limit));
  
  // Get user stats by role
  const stats = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);
  
  // Format stats
  const statsObject = {
    admin: 0,
    recruiter: 0,
    'job-seeker': 0
  };
  
  stats.forEach(stat => {
    statsObject[stat._id] = stat.count;
  });
  
  res.status(200).json({
    users,
    totalUsers,
    numOfPages,
    currentPage: Number(page),
    stats: statsObject
  });
};

/**
 * Get a single user by ID (admin only)
 */
const getUser = async (req, res) => {
  const { id: userId } = req.params;
  
  // Validate user ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new BadRequestError('Invalid user ID');
  }
  
  // Find user
  const user = await User.findById(userId).select('-password');
  
  if (!user) {
    throw new NotFoundError(`No user found with id: ${userId}`);
  }
  
  res.status(200).json({ user });
};

/**
 * Update user role (admin only)
 */
const updateUserRole = async (req, res) => {
  const { id: userId } = req.params;
  const { role } = req.body;
  
  if (!role || !['admin', 'recruiter', 'job-seeker'].includes(role)) {
    throw new BadRequestError('Please provide a valid role');
  }
  
  // Validate user ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new BadRequestError('Invalid user ID');
  }
  
  // Find user
  const user = await User.findById(userId);
  
  if (!user) {
    throw new NotFoundError(`No user found with id: ${userId}`);
  }
  
  // Update user role
  user.role = role;
  await user.save();
  
  res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

/**
 * Delete a user (admin only)
 */
const deleteUser = async (req, res) => {
  const { id: userId } = req.params;
  
  // Validate user ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new BadRequestError('Invalid user ID');
  }
  
  // Find user
  const user = await User.findById(userId);
  
  if (!user) {
    throw new NotFoundError(`No user found with id: ${userId}`);
  }
  
  // Prevent deleting self
  if (user._id.toString() === req.user.userId) {
    throw new BadRequestError('You cannot delete your own account');
  }
  
  // Delete user
  await user.deleteOne();
  
  res.status(200).json({ message: 'User deleted successfully' });
};

module.exports = {
  getCurrentUser,
  updateProfile,
  uploadProfileImage,
  uploadResume,
  getAllUsers,
  getUser,
  updateUserRole,
  deleteUser
}; 