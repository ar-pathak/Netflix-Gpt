import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { ToastProvider } from "./context/ToastContext";
import { UserProvider } from "./context/UserContext";
import Login from "./components/auth/Login";
import Browse from "./components/Browse";
import Profile from "./components/auth/Profile";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { useContext } from "react";
import UserContext from "./context/UserContext";
import { useToast } from "./context/ToastContext";

// Public route guard - redirects to browse if already logged in
const PublicRoute = ({ children }) => {
    const { loggedInStatus } = useContext(UserContext);
    const { showToast } = useToast();

    if (loggedInStatus) {
        showToast("You are already logged in", "info");
        return <Navigate to="/browse" replace />;
    }

    return children;
};

// Root route handler - redirects based on auth status
const RootRoute = () => {
    const { loggedInStatus } = useContext(UserContext);

    // If auth status is known, redirect accordingly
    if (loggedInStatus !== null) {
        return loggedInStatus ? <Navigate to="/browse" replace /> : <Navigate to="/login" replace />;
    }

    // Show loading while checking auth status
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
            <p className="text-white text-lg">Loading...</p>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <UserProvider>
                <ToastProvider>
                    <Routes>
                        {/* Public Routes - Redirect to browse if logged in */}
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <Login defaultForm="signin" />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/signup"
                            element={
                                <PublicRoute>
                                    <Login defaultForm="signup" />
                                </PublicRoute>
                            }
                        />

                        {/* Protected Routes - Require authentication */}
                        <Route
                            path="/browse"
                            element={
                                <ProtectedRoute>
                                    <Browse />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />

                        {/* Root Route - Redirect based on auth status */}
                        <Route path="/" element={<RootRoute />} />

                        {/* Catch all - Redirect to root */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </ToastProvider>
            </UserProvider>
        </Router>
    );
};

export default App;
