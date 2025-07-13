import React from 'react';

function LoadingSpinner({ size = 'medium', color = 'primary' }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    white: 'text-white',
    gray: 'text-gray-400'
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`loading-spinner border-2 border-current border-t-transparent rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
      />
    </div>
  );
}

export default LoadingSpinner; 