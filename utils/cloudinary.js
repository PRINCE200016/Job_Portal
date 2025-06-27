const cloudinary = require('cloudinary').v2;
const { 
  CLOUDINARY_CLOUD_NAME, 
  CLOUDINARY_API_KEY, 
  CLOUDINARY_API_SECRET 
} = require('../config/config');

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

/**
 * Upload a file to Cloudinary
 * @param {string} filePath - The file path to upload
 * @param {string} folder - The folder name in Cloudinary
 * @returns {Promise} - Promise with the upload result
 */
const uploadFile = async (filePath, folder = 'jobify') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto'
    });
    return result;
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw new Error('File upload failed');
  }
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - The public ID of the file to delete
 * @returns {Promise} - Promise with the deletion result
 */
const deleteFile = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw new Error('File deletion failed');
  }
};

module.exports = {
  uploadFile,
  deleteFile
}; 