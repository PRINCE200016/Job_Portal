import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaMapMarkerAlt, FaBriefcase, FaCalendarAlt, FaDollarSign, FaFileAlt, FaArrowLeft } from 'react-icons/fa';
import { getJobById } from '../redux/slices/jobSlice';
import { applyForJob } from '../redux/slices/applicationSlice';
import { showNotification } from '../redux/slices/uiSlice';

const JobDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { job, isLoading } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);
  const { applications } = useSelector((state) => state.applications);
  
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);

  // Check if user has already applied to this job
  const hasApplied = applications.some(app => app.jobId === id);

  useEffect(() => {
    dispatch(getJobById(id));
  }, [dispatch, id]);

  const handleApply = (e) => {
    e.preventDefault();
    
    if (!resumeFile && !coverLetter) {
      dispatch(showNotification({
        message: 'Please upload a resume or provide a cover letter',
        type: 'error',
      }));
      return;
    }

    const applicationData = {
      jobId: id,
      resumeUrl: resumeFile ? URL.createObjectURL(resumeFile) : '',
      coverLetter,
    };

    dispatch(applyForJob(applicationData));
    dispatch(showNotification({
      message: 'Application submitted successfully!',
      type: 'success',
    }));
    setShowApplyForm(false);
  };

  const handleFileChange = (e) => {
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

  if (isLoading || !job) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-blue-600 dark:text-blue-400 mb-6 hover:underline"
      >
        <FaArrowLeft className="mr-2" /> Back to Jobs
      </button>
      
      {/* Job header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">{job.title}</h1>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <FaBriefcase className="mr-2" />
            <span>{job.company}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <FaMapMarkerAlt className="mr-2" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <FaDollarSign className="mr-2" />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <FaCalendarAlt className="mr-2" />
            <span>Posted: {job.postedDate}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <FaCalendarAlt className="mr-2" />
            <span>Deadline: {job.deadline}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
            {job.type}
          </span>
          {job.requirements.split(',').map((req, index) => (
            <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">
              {req.trim()}
            </span>
          ))}
        </div>
        
        {user && user.role === 'jobseeker' && (
          <div className="mt-4">
            {hasApplied ? (
              <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-md">
                You have already applied to this job.
              </div>
            ) : (
              <button
                onClick={() => setShowApplyForm(!showApplyForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
              >
                Apply Now
              </button>
            )}
          </div>
        )}
        
        {!user && (
          <div className="mt-4">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors inline-block"
            >
              Login to Apply
            </Link>
          </div>
        )}
      </div>
      
      {/* Job description */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Job Description</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300">{job.description}</p>
        </div>
      </div>
      
      {/* Application form */}
      {showApplyForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Apply for this Position</h2>
          
          <form onSubmit={handleApply}>
            <div className="mb-4">
              <label htmlFor="resume" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Resume (PDF or Word)
              </label>
              <div className="flex items-center">
                <label className="flex-1">
                  <div className="flex items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaFileAlt className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PDF or Word (MAX. 2MB)</p>
                    </div>
                    <input 
                      id="resume" 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.doc,.docx" 
                      onChange={handleFileChange}
                    />
                  </div>
                </label>
              </div>
              {resumeFile && (
                <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                  File selected: {resumeFile.name}
                </p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="coverLetter" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Cover Letter
              </label>
              <textarea
                id="coverLetter"
                rows="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Tell us why you're a good fit for this position..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowApplyForm(false)}
                className="mr-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-6 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default JobDetails; 