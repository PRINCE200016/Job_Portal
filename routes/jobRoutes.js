const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
  getMyJobs,
  updateJobStatus,
  getJobStats
} = require('../controllers/jobController');
const authMiddleware = require('../middleware/auth');
const authorizeMiddleware = require('../middleware/authorize');

// All routes require authentication
router.use(authMiddleware);

// Public routes (still require authentication)
router.get('/', getAllJobs);
router.get('/:id', getJob);

// Job seeker routes
// None specific to job seekers for jobs

// Recruiter and admin routes
router.post('/', authorizeMiddleware('recruiter', 'admin'), createJob);
router.patch('/:id', authorizeMiddleware('recruiter', 'admin'), updateJob);
router.delete('/:id', authorizeMiddleware('recruiter', 'admin'), deleteJob);
router.get('/my-jobs/all', authorizeMiddleware('recruiter', 'admin'), getMyJobs);
router.patch('/:id/status', authorizeMiddleware('recruiter', 'admin'), updateJobStatus);
router.get('/stats/all', authorizeMiddleware('recruiter', 'admin'), getJobStats);

module.exports = router; 