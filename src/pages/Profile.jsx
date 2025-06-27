import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaUser, FaEnvelope, FaPhone, FaLinkedin, FaFileAlt, FaCamera } from 'react-icons/fa';
import { showNotification } from '../redux/slices/uiSlice';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('https://via.placeholder.com/150');
  const [resumeFile, setResumeFile] = useState(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    linkedin: '',
    bio: '',
    skills: '',
  });
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  
  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setProfileImage(file);
      setProfileImageUrl(URL.createObjectURL(file));
    } else {
      dispatch(showNotification({
        message: 'Please select a valid image file',
        type: 'error',
      }));
    }
  };
  
  // Handle resume file change
  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setResumeFile(file);
    } else {
      dispatch(showNotification({
        message: 'Please upload a PDF or Word document',
        type: 'error',
      }));
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would send the data to the server
    // For now, just show a success notification
    dispatch(showNotification({
      message: 'Profile updated successfully!',
      type: 'success',
    }));
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">My Profile</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row">
          {/* Profile Image Section */}
          <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
            <div className="relative mb-4">
              <img 
                src={profileImageUrl} 
                alt="Profile" 
                className="w-40 h-40 rounded-full object-cover border-4 border-blue-500"
              />
              <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                <FaCamera />
                <input 
                  type="file" 
                  id="profile-image" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{user?.name}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">{user?.role === 'jobseeker' ? 'Job Seeker' : 'Recruiter'}</p>
            
            {user?.role === 'jobseeker' && (
              <div className="mt-4 w-full">
                <label htmlFor="resume" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                  Resume / CV
                </label>
                <div className="flex justify-center">
                  <label className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
                    <FaFileAlt className="mr-2" />
                    {resumeFile ? 'Change Resume' : 'Upload Resume'}
                    <input 
                      type="file" 
                      id="resume" 
                      className="hidden" 
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                    />
                  </label>
                </div>
                {resumeFile && (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400 text-center">
                    {resumeFile.name}
                  </p>
                )}
              </div>
            )}
          </div>
          
          {/* Profile Form Section */}
          <div className="md:w-2/3 md:pl-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Your full name"
                    />
                  </div>
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Your email address"
                      readOnly
                    />
                  </div>
                </div>
                
                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
                
                {/* LinkedIn */}
                <div>
                  <label htmlFor="linkedin" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    LinkedIn Profile
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaLinkedin className="text-gray-400" />
                    </div>
                    <input
                      type="url"
                      id="linkedin"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="LinkedIn profile URL"
                    />
                  </div>
                </div>
              </div>
              
              {user?.role === 'jobseeker' && (
                <div className="mb-6">
                  <label htmlFor="skills" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="e.g. JavaScript, React, Node.js"
                  />
                </div>
              )}
              
              <div className="mb-6">
                <label htmlFor="bio" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.role === 'jobseeker' ? 'Professional Summary' : 'Company Description'}
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder={user?.role === 'jobseeker' ? 'Write a brief summary about yourself...' : 'Describe your company...'}
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 