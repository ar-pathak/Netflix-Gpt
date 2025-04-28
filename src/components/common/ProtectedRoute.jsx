import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router';
import { useToast } from '../../context/ToastContext';
import UserContext from '../../context/UserContext';
import { ROUTES } from '../../utils/constants';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(UserContext);
    const { showToast } = useToast();

    useEffect(() => {
        if (!loading && !user) {
            showToast('Please sign in to access this page', 'error');
        }
    }, [user, loading, showToast]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
                <p className="text-white text-lg">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return children;
};

export default ProtectedRoute; 