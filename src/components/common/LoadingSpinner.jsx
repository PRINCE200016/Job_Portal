import React from 'react';

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  // Size variants
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
    xl: 'w-24 h-24 border-4',
  };
  
  const spinnerClass = sizeClasses[size] || sizeClasses.md;
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100/70 dark:bg-gray-900/70 z-50">
        <div className={`${spinnerClass} rounded-full border-blue-500 border-t-transparent animate-spin`}></div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center p-4">
      <div className={`${spinnerClass} rounded-full border-blue-500 border-t-transparent animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner; 