import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import { hideNotification } from '../../redux/slices/uiSlice';

const Notification = () => {
  const dispatch = useDispatch();
  const { notification } = useSelector((state) => state.ui);

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification.show, dispatch]);

  // Close notification manually
  const handleClose = () => {
    dispatch(hideNotification());
  };

  // Get icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <FaCheckCircle className="text-green-500 text-xl" />;
      case 'error':
        return <FaTimesCircle className="text-red-500 text-xl" />;
      case 'warning':
        return <FaExclamationCircle className="text-yellow-500 text-xl" />;
      default:
        return <FaInfoCircle className="text-blue-500 text-xl" />;
    }
  };

  // Get background color based on notification type
  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-100 dark:bg-green-900';
      case 'error':
        return 'bg-red-100 dark:bg-red-900';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900';
      default:
        return 'bg-blue-100 dark:bg-blue-900';
    }
  };

  if (!notification.show) {
    return null;
  }

  return (
    <div
      className={`fixed top-20 right-4 z-50 p-4 rounded-md shadow-md max-w-md ${getBackgroundColor()}`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{notification.message}</p>
        </div>
        <button
          type="button"
          className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={handleClose}
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  );
};

export default Notification; 