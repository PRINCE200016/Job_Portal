import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllJobs, setFilters } from '../redux/slices/jobSlice';
import { FiSearch, FiMapPin, FiBriefcase, FiDollarSign } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Home = () => {
  const dispatch = useDispatch();
  const { jobs, isLoading, filters } = useSelector((state) => state.jobs);
  const [searchForm, setSearchForm] = useState({
    search: filters.search || '',
    location: filters.location || '',
    type: filters.type || '',
    salary: filters.salary || '',
  });
  
  useEffect(() => {
    dispatch(getAllJobs(filters));
  }, [dispatch, filters]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm({
      ...searchForm,
      [name]: value,
    });
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters(searchForm));
  };
  
  return (
    <div className="py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 rounded-lg mb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Dream Job Today</h1>
            <p className="text-lg md:text-xl mb-8">
              Discover thousands of job opportunities with all the information you need. It's your future.
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="search"
                    value={searchForm.search}
                    onChange={handleInputChange}
                    placeholder="Job title or keyword"
                    className="pl-10 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={searchForm.location}
                    onChange={handleInputChange}
                    placeholder="Location"
                    className="pl-10 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiBriefcase className="text-gray-400" />
                  </div>
                  <select
                    name="type"
                    value={searchForm.type}
                    onChange={handleInputChange}
                    className="pl-10 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    <option value="">Job Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Search Jobs
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      
      {/* Job Listings */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Recent Job Listings</h2>
        
        {isLoading ? (
          <LoadingSpinner />
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No jobs found. Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{job.company}</p>
                  
                  <div className="flex items-center mb-2">
                    <FiMapPin className="text-gray-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">{job.location}</span>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <FiBriefcase className="text-gray-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">{job.type}</span>
                    
                    <FiDollarSign className="text-gray-500 ml-4 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">{job.salary}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Posted on {job.postedDate}
                    </span>
                    <Link 
                      to={`/job/${job.id}`}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      
      {/* Featured Categories */}
      <section className="container mx-auto px-4 mt-16">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Browse by Category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div 
              key={category.name}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
            >
              <div className="text-blue-600 text-3xl mb-3">{category.icon}</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{category.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{category.count} jobs</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="container mx-auto px-4 mt-16 mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Career Journey?</h2>
          <p className="text-lg mb-6">Join thousands of people who've found their dream job using Jobify.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/register"
              className="bg-white text-blue-600 hover:bg-gray-100 py-3 px-6 rounded-md font-medium"
            >
              Create an Account
            </Link>
            <Link 
              to="/login"
              className="bg-transparent border border-white text-white hover:bg-white/10 py-3 px-6 rounded-md font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Sample categories data
const categories = [
  { name: 'Technology', icon: '💻', count: 120 },
  { name: 'Marketing', icon: '📊', count: 85 },
  { name: 'Design', icon: '🎨', count: 67 },
  { name: 'Finance', icon: '💰', count: 92 },
  { name: 'Healthcare', icon: '⚕️', count: 143 },
  { name: 'Education', icon: '🎓', count: 76 },
  { name: 'Customer Service', icon: '🤝', count: 54 },
  { name: 'Engineering', icon: '⚙️', count: 110 },
];

export default Home; 