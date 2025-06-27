import { Link, useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-red-500 mb-6">
        <FaLock size={80} />
      </div>
      <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">Unauthorized Access</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        You do not have permission to access this page.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={goBack}
          className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-3 px-8 rounded-md transition-colors"
        >
          Go Back
        </button>
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md transition-colors text-center"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized; 