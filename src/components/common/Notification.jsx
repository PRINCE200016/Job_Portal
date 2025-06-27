import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideNotification } from '../../redux/slices/uiSlice';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

const Notification = () => {
  const { notification } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  
  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notification.show, dispatch]);
  
  if (!notification.show) {
    return null;
  }
  
  // Define icon and color based on notification type
  const getNotificationStyles = () => {
    switch (notification.type) {
      case 'success':
        return {
          icon: <FiCheckCircle className="w-6 h-6" />,
          bgColor: 'bg-green-100 dark:bg-green-900',
          textColor: 'text-green-800 dark:text-green-200',
          borderColor: 'border-green-500',
        };
      case 'error':
        return {
          icon: <FiAlertCircle className="w-6 h-6" />,
          bgColor: 'bg-red-100 dark:bg-red-900',
          textColor: 'text-red-800 dark:text-red-200',
          borderColor: 'border-red-500',
        };
      case 'warning':
        return {
          icon: <FiAlertTriangle className="w-6 h-6" />,
          bgColor: 'bg-yellow-100 dark:bg-yellow-900',
          textColor: 'text-yellow-800 dark:text-yellow-200',
          borderColor: 'border-yellow-500',
        };
      case 'info':
      default:
        return {
          icon: <FiInfo className="w-6 h-6" />,
          bgColor: 'bg-blue-100 dark:bg-blue-900',
          textColor: 'text-blue-800 dark:text-blue-200',
          borderColor: 'border-blue-500',
        };
    }
  };
  
  const { icon, bgColor, textColor, borderColor } = getNotificationStyles();
  
  return (
    <div className="fixed top-20 right-4 z-50 max-w-md animate-slide-in">
      <div className={`flex items-center p-4 rounded-lg shadow-lg border-l-4 ${bgColor} ${borderColor}`}>
        <div className={`mr-3 ${textColor}`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${textColor}`}>{notification.message}</p>
        </div>
        <button
          onClick={() => dispatch(hideNotification())}
          className={`ml-4 ${textColor} hover:opacity-75`}
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Notification; 