import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-yellow-500 mb-6">
        <FaExclamationTriangle size={80} />
      </div>
      <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
 