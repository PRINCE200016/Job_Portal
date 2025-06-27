const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide job title'],
      maxlength: 100,
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      maxlength: 100,
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide job location'],
      maxlength: 100,
      trim: true,
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'internship', 'contract'],
      default: 'full-time',
    },
    status: {
      type: String,
      enum: ['open', 'interview', 'closed'],
      default: 'open',
    },
    description: {
      type: String,
      required: [true, 'Please provide job description'],
      trim: true,
    },
    requirements: {
      type: String,
      required: [true, 'Please provide job requirements'],
      trim: true,
    },
    responsibilities: {
      type: String,
      trim: true,
    },
    salary: {
      min: {
        type: Number,
      },
      max: {
        type: Number,
      },
      currency: {
        type: String,
        default: 'USD',
      },
      isPeriodic: {
        type: Boolean,
        default: true,
      },
      period: {
        type: String,
        enum: ['hour', 'day', 'week', 'month', 'year'],
        default: 'year',
      },
    },
    experience: {
      type: String,
      enum: ['entry', 'junior', 'mid-level', 'senior', 'executive'],
      default: 'mid-level',
    },
    skills: {
      type: [String],
    },
    benefits: {
      type: [String],
    },
    applicationDeadline: {
      type: Date,
    },
    companyLogo: {
      type: String,
    },
    companyWebsite: {
      type: String,
    },
    contactEmail: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Add virtual for applications count
JobSchema.virtual('applicationsCount', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'job',
  count: true,
});

// Add text index for searching
JobSchema.index({ 
  title: 'text', 
  company: 'text', 
  description: 'text',
  requirements: 'text',
  responsibilities: 'text'
});

module.exports = mongoose.model('Job', JobSchema); 