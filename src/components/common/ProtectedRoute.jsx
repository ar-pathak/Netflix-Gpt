import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import UserContext from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';

const ProtectedRoute = ({ children, requireVerification = false }) => {
    const { loggedInStatus, user } = useContext(UserContext);
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let timeoutId;
        let isMounted = true;

        const checkAuth = async () => {
            // If auth state is determined
            if (loggedInStatus !== null) {
                if (isMounted) {
                    setIsLoading(false);
                }

                // If not logged in, redirect immediately
                if (!loggedInStatus) {
                    return;
                }
            } else {
                // If still checking auth, set a timeout to prevent infinite loading
                timeoutId = setTimeout(() => {
                    if (isMounted) {
                        setIsLoading(false);
                    }
                }, 2000);
            }
        };

        checkAuth();

        // Cleanup function
        return () => {
            isMounted = false;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [loggedInStatus]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
                <p className="text-white text-lg">Loading...</p>
            </div>
        );
    }

    // If not logged in, redirect to login with toast
    if (!loggedInStatus) {
        setTimeout(() => {
            showToast('Please sign in to access this page', 'error');
        }, 100);
        return <Navigate to="/login" replace />;
    }

    // Only check email verification if explicitly required
    if (requireVerification && user && !user.emailVerified) {
        setTimeout(() => {
            showToast('Please verify your email address to access this page', 'error');
        }, 100);
        return <Navigate to="/login" replace />;
    }

    // If everything is ok, render the protected content
    return children;
};

export default ProtectedRoute; 