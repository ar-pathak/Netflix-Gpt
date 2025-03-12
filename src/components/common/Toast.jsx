import React, { useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    // Handle cleanup of animation when component unmounts
    return () => {
      const toasts = document.querySelectorAll('.animate-slide-in');
      toasts.forEach(toast => {
        toast.classList.remove('animate-slide-in');
        toast.classList.add('animate-fade-out');
      });
    };
  }, []);

  const typeStyles = {
    info: {
      bg: 'bg-gray-800',
      label: 'Information message'
    },
    success: {
      bg: 'bg-green-600',
      label: 'Success message'
    },
    error: {
      bg: 'bg-red-600',
      label: 'Error message'
    },
    warning: {
      bg: 'bg-yellow-500',
      label: 'Warning message'
    }
  };

  const icons = {
    info: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    success: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />,
    error: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />,
    warning: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  };

  const style = typeStyles[type] || typeStyles.info;

  return (
    <div 
      role="alert"
      aria-live="polite"
      aria-label={style.label}
      className={`fixed top-4 right-4 p-4 rounded-md shadow-lg transform transition-all duration-500 ease-in-out z-50 flex items-center gap-2 ${style.bg} text-white animate-slide-in`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        {icons[type]}
      </svg>
      
      <span className="text-sm font-medium">{message}</span>
      
      <button
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white rounded-sm"
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Toast; 