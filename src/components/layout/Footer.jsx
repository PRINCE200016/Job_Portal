import { Link } from 'react-router-dom';
import { BsBriefcase } from 'react-icons/bs';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-8 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <BsBriefcase className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">Jobify</span>
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Connecting talent with opportunity. Find your dream job or the perfect candidate.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400">
                <FaFacebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400">
                <FaTwitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400">
                <FaLinkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400">
                <FaInstagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
          
          {/* For Job Seekers */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">For Job Seekers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/applications" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                  My Applications
                </Link>
              </li>
            </ul>
          </div>
          
          {/* For Employers */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">For Employers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/post-job" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">Email:</span> info@jobify.com
              </li>
              <li className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">Phone:</span> +1 (555) 123-4567
              </li>
              <li className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">Address:</span> 123 Job Street, Work City, 10001
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            &copy; {currentYear} Jobify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 