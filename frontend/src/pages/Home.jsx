import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';
import { getJobs, setFilters } from '../redux/slices/jobSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { jobs, isLoading, filters } = useSelector((state) => state.jobs);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [location, setLocation] = useState(filters.location || '');
  const [jobType, setJobType] = useState(filters.type || '');

  // Job categories for the category section
  const categories = [
    { name: 'Technology', icon: '💻', count: 120 },
    { name: 'Healthcare', icon: '🏥', count: 87 },
    { name: 'Finance', icon: '💰', count: 65 },
    { name: 'Education', icon: '🎓', count: 42 },
    { name: 'Marketing', icon: '📊', count: 38 },
    { name: 'Design', icon: '🎨', count: 29 },
  ];

  // Fetch jobs on component mount
  useEffect(() => {
    dispatch(getJobs());
  }, [dispatch]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(
      setFilters({
        search: searchTerm,
        location,
        type: jobType,
      })
    );
    dispatch(getJobs());
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Job Today</h1>
            <p className="text-xl mb-8">
              Discover thousands of job opportunities with all the information you need.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Job title or keywords"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaBriefcase className="text-gray-400" />
                  </div>
                  <select
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                  >
                    <option value="">All Job Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Searching...' : 'Search Jobs'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
            Featured Jobs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.slice(0, 6).map((job) => (
              <div
                key={job.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                    {job.title}
                  </h3>
                  <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
                    <FaBriefcase className="mr-2" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center mb-4 text-gray-600 dark:text-gray-300">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                      {job.type}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Posted: {job.postedDate}
                    </span>
                  </div>
                  <Link
                    to={`/job/${job.id}`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {jobs.length > 6 && (
            <div className="text-center mt-8">
              <Link
                to="/jobs"
                className="inline-block bg-white dark:bg-gray-800 border border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 font-medium py-2 px-6 rounded-md transition-colors"
              >
                View All Jobs
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
            Popular Categories
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <div
                key={category.name}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{category.count} jobs</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Career Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have found their dream jobs through Jobify.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-md transition-colors"
            >
              Sign Up Now
            </Link>
            <Link
              to="/jobs"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-3 px-8 rounded-md transition-colors"
            >
              Browse All Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 