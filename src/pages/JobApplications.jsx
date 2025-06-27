import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft, FaFilter, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { getJobById } from '../redux/slices/jobSlice';
import { getJobApplications, updateApplicationStatus } from '../redux/slices/applicationSlice';
import { showNotification } from '../redux/slices/uiSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';

const JobApplications = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { job } = useSelector((state) => state.jobs);
  const { applications, isLoading } = useSelector((state) => state.applications);
  const { user } = useSelector((state) => state.auth);
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  
  useEffect(() => {
    dispatch(getJobById(id));
    dispatch(getJobApplications(id));
  }, [dispatch, id]);
  
  // Check if user is a recruiter
  if (user && user.role !== 'recruiter') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-md">
          You do not have permission to access this page.
        </div>
      </div>
    );
  }
  
  // Filter and sort applications
  const filteredApplications = applications
    .filter((app) => {
      return statusFilter === 'all' || app.status === statusFilter;
    })
    .sort((a, b) => {
      // Sort by date
      const dateA = new Date(a.appliedDate);
      const dateB = new Date(b.appliedDate);
      
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  
  const handleStatusChange = (applicationId, newStatus) => {
    dispatch(updateApplicationStatus({ id: applicationId, status: newStatus }));
    dispatch(showNotification({
      message: `Application status updated to ${newStatus}`,
      type: 'success',
    }));
  };
  
  // Get application status badge style
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-blue-600 dark:text-blue-400 mb-6 hover:underline"
      >
        <FaArrowLeft className="mr-2" /> Back to Jobs
      </button>
      
      {/* Job title header */}
      {job && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Applications for: {job.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {job.company} • {job.location}
          </p>
        </div>
      )}
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <button
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? (
              <>
                <FaSortAmountUp className="mr-2" />
                <span>Oldest First</span>
              </>
            ) : (
              <>
                <FaSortAmountDown className="mr-2" />
                <span>Newest First</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Applications List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner />
          </div>
        ) : filteredApplications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Resume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredApplications.map((application) => (
                  <tr key={application.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {application.userId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {application.appliedDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {application.resume ? (
                        <a
                          href={application.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          View Resume
                        </a>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">No resume</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <select
                        className="border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={application.status}
                        onChange={(e) => handleStatusChange(application.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accept</option>
                        <option value="rejected">Reject</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {statusFilter !== 'all'
                ? 'No applications match your filter criteria.'
                : 'No applications have been submitted for this job yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplications; 