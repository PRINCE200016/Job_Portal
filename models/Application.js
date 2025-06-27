const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Please provide job'],
    },
    applicant: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide applicant'],
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'interview', 'rejected', 'accepted'],
      default: 'pending',
    },
    resume: {
      url: {
        type: String,
        required: [true, 'Please provide resume URL'],
      },
      name: {
        type: String,
        required: [true, 'Please provide resume name'],
      },
      publicId: String,
    },
    coverLetter: {
      type: String,
      trim: true,
    },
    additionalDocuments: [
      {
        url: String,
        name: String,
        publicId: String,
      },
    ],
    notes: {
      type: String,
      trim: true,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    interviewDate: {
      type: Date,
    },
    interviewLocation: {
      type: String,
      trim: true,
    },
    interviewNotes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Ensure one application per user per job
ApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

// Add static method to get application counts by status
ApplicationSchema.statics.getStatusCounts = async function (userId) {
  return this.aggregate([
    { $match: { applicant: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
};

module.exports = mongoose.model('Application', ApplicationSchema); 