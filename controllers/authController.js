const User = require('../models/User');
const { BadRequestError, UnauthorizedError, NotFoundError } = require('../utils/errors');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../utils/email');
const crypto = require('crypto');

/**
 * Register a new user
 */
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if required fields are provided
  if (!name || !email || !password) {
    throw new BadRequestError('Please provide all required fields');
  }

  // Check if email already exists
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new BadRequestError('Email already exists');
  }

  // Only admins can create admin or recruiter users
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const finalRole = isFirstAccount ? 'admin' : role || 'job-seeker';

  // Create the user
  const user = await User.create({ name, email, password, role: finalRole });
  
  // Send welcome email
  try {
    await sendWelcomeEmail(name, email);
  } catch (error) {
    console.log('Error sending welcome email', error);
  }

  // Create JWT token
  const token = user.createJWT();

  // Return user data (excluding password)
  res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      profileImage: user.profileImage,
    },
    token,
  });
};

/**
 * Login user
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  // Find the user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Check if password is correct
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Create JWT token
  const token = user.createJWT();

  // Return user data (excluding password)
  res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      profileImage: user.profileImage,
    },
    token,
  });
};

/**
 * Request password reset
 */
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    throw new BadRequestError('Please provide an email address');
  }

  // Find the user
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Generate reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;

  try {
    // Send password reset email
    await sendPasswordResetEmail(user.name, user.email, resetURL);
    
    res.status(200).json({
      message: 'Password reset link sent to your email',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    
    throw new Error('Error sending password reset email. Please try again later.');
  }
};

/**
 * Reset password
 */
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  
  if (!password) {
    throw new BadRequestError('Please provide a new password');
  }

  // Hash the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Find user with the token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new BadRequestError('Token is invalid or has expired');
  }

  // Update user's password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Return success message
  res.status(200).json({
    message: 'Password reset successful. Please log in with your new password.',
  });
};

/**
 * Update user's own password
 */
const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId;

  if (!oldPassword || !newPassword) {
    throw new BadRequestError('Please provide both old and new passwords');
  }

  // Find the user
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  // Verify old password
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    message: 'Password updated successfully',
  });
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
}; 