import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaBriefcase, FaCheckCircle, FaTimesCircle, FaUserClock, FaChartBar } from 'react-icons/fa';
import { getAllJobs } from '../redux/slices/jobSlice';
import { getUserApplications } from '../redux/slices/applicationSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { jobs } = useSelector((state) => state.jobs);
  const { applications } = useSelector((state) => state.applications);

  useEffect(() => {
    dispatch(getAllJobs());
    if (user && user.role === 'jobseeker') {
      dispatch(getUserApplications());
    }
  }, [dispatch, user]);

  // Job seeker dashboard stats
  const getJobSeekerStats = () => {
    const totalApplications = applications.length;
    const pending = applications.filter((app) => app.status === 'Applied' || app.status === 'Under Review').length;
    const accepted = applications.filter((app) => app.status === 'Selected' || app.status === 'Hired').length;
    const rejected = applications.filter((app) => app.status === 'Rejected').length;

    return { totalApplications, pending, accepted, rejected };
  };

  // Recruiter dashboard stats
  const getRecruiterStats = () => {
    const postedJobs = jobs.length;
    const activeJobs = jobs.filter((job) => new Date(job.deadline) >= new Date()).length;
    const expiredJobs = jobs.filter((job) => new Date(job.deadline) < new Date()).length;
    const totalApplications = 42; // This would come from the API in a real app

    return { postedJobs, activeJobs, expiredJobs, totalApplications };
  };

  // Render job seeker dashboard
  const renderJobSeekerDashboard = () => {
    const stats = getJobSeekerStats();

    return (
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Job Seeker Dashboard</h2>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                <FaBriefcase size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Applications</h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalApplications}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300">
                <FaUserClock size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Pending</h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                <FaCheckCircle size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Accepted</h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.accepted}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">
                <FaTimesCircle size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Rejected</h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent applications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Applications</h3>
          
          {applications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {applications.slice(0, 5).map((application) => {
                    const job = jobs.find((j) => j.id === application.jobId) || {
                      title: 'Unknown Job',
                      company: 'Unknown Company',
                    };
                    
                    return (
                      <tr key={application.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {job.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {job.company}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {application.appliedDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              application.status === 'Applied'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : application.status === 'Under Review'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : application.status === 'Selected' || application.status === 'Hired'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                          >
                            {application.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">You haven't applied to any jobs yet.</p>
          )}
        </div>
      </div>
    );
  };

  // Render recruiter dashboard
  const renderRecruiterDashboard = () => {
    const stats = getRecruiterStats();

    return (
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Recruiter Dashboard</h2>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                <FaBriefcase size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Posted Jobs</h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.postedJobs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                <FaCheckCircle size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Active Jobs</h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.activeJobs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">
                <FaTimesCircle size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Expired Jobs</h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.expiredJobs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                <FaChartBar size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Applications</h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalApplications}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent jobs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Job Postings</h3>
          
          {jobs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Posted Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Deadline
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Applications
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {jobs.slice(0, 5).map((job) => (
                    <tr key={job.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {job.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {job.postedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {job.deadline}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {Math.floor(Math.random() * 20)} applicants
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">You haven't posted any jobs yet.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {user && user.role === 'jobseeker' ? renderJobSeekerDashboard() : renderRecruiterDashboard()}
    </div>
  );
};

export default Dashboard; 