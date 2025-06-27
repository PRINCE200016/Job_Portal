const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_LIFETIME } = require('../config/config');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false, // Don't include password in query results by default
    },
    role: {
      type: String,
      enum: ['admin', 'recruiter', 'job-seeker'],
      default: 'job-seeker',
    },
    location: {
      type: String,
      trim: true,
      maxlength: 100,
      default: 'My City',
    },
    profileImage: {
      type: String,
      default: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/placeholder-avatar',
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    skills: {
      type: [String],
    },
    resumeUrl: {
      type: String,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    socialLinks: {
      linkedin: String,
      github: String,
      twitter: String,
      portfolio: String,
    },
    company: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    jobTitle: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Create JWT token
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, role: this.role },
    JWT_SECRET,
    { expiresIn: JWT_LIFETIME }
  );
};

// Compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create password reset token
UserSchema.methods.createPasswordResetToken = function () {
  // Generate a random token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash the token and save it to the user
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Set token expiry (15 minutes)
  this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
  
  return resetToken;
};

module.exports = mongoose.model('User', UserSchema); 