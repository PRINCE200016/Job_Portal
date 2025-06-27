const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  createApplication,
  getJobApplications,
  getMyApplications,
  getApplication,
  updateApplicationStatus,
  deleteApplication
} = require('../controllers/applicationController');
const authMiddleware = require('../middleware/auth');
const authorizeMiddleware = require('../middleware/authorize');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    // Accept pdf, doc, docx
    const filetypes = /pdf|doc|docx/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
  }
});

// All routes require authentication
router.use(authMiddleware);

// Job seeker routes
router.post('/', upload.single('resume'), createApplication);
router.get('/my-applications', getMyApplications);
router.delete('/:id', deleteApplication);

// Shared routes
router.get('/:id', getApplication);

// Recruiter and admin routes
router.get('/job/:jobId', authorizeMiddleware('recruiter', 'admin'), getJobApplications);
router.patch('/:id/status', authorizeMiddleware('recruiter', 'admin'), updateApplicationStatus);

module.exports = router; 