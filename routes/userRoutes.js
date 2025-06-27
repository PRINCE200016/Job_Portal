const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getCurrentUser,
  updateProfile,
  uploadProfileImage,
  uploadResume,
  getAllUsers,
  getUser,
  updateUserRole,
  deleteUser
} = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const authorizeMiddleware = require('../middleware/authorize');

// Configure multer for image uploads
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const imageUpload = multer({ 
  storage: imageStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    // Accept images only
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    
    cb(new Error('Only image files are allowed'));
  }
});

// Configure multer for resume uploads
const resumeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const resumeUpload = multer({ 
  storage: resumeStorage,
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

// Routes for all authenticated users
router.get('/me', getCurrentUser);
router.patch('/profile', updateProfile);
router.post('/profile/image', imageUpload.single('image'), uploadProfileImage);
router.post('/profile/resume', resumeUpload.single('resume'), uploadResume);

// Admin only routes
router.get('/', authorizeMiddleware('admin'), getAllUsers);
router.get('/:id', authorizeMiddleware('admin'), getUser);
router.patch('/:id/role', authorizeMiddleware('admin'), updateUserRole);
router.delete('/:id', authorizeMiddleware('admin'), deleteUser);

module.exports = router;