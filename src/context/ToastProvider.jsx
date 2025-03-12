import React, { useState } from 'react';
import Toast from '../components/common/Toast';
import ToastContext from './ToastContext';
import ToastErrorBoundary from '../components/common/ToastErrorBoundary';

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  const [toastQueue, setToastQueue] = useState([]);

  const showToast = (message, type = 'info') => {
    if (toast.visible) {
      // If a toast is already visible, queue the new one
      setToastQueue(prev => [...prev, { message, type }]);
      return;
    }

    setToast({ visible: true, message, type });
    setTimeout(() => {
      hideToast();
    }, 3000);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
    
    // Show next toast in queue if any
    setTimeout(() => {
      if (toastQueue.length > 0) {
        const [nextToast, ...remainingToasts] = toastQueue;
        setToastQueue(remainingToasts);
        showToast(nextToast.message, nextToast.type);
      }
    }, 300); // Small delay between toasts
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastErrorBoundary>
        {toast.visible && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}
      </ToastErrorBoundary>
    </ToastContext.Provider>
  );
}; 