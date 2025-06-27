import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              &copy; {currentYear} Jobify. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={20} />
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              aria-label="GitHub"
            >
              <FaGithub size={20} />
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-300"
              aria-label="Twitter"
            >
              <FaTwitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 