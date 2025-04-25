import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { ToastProvider } from "./context/ToastContext";
import { UserProvider } from "./context/UserContext";
import { ROUTES } from "./utils/constants";
import Login from "./components/auth/Login";
import Browse from "./components/Browse";
import Profile from "./components/auth/Profile";
import Settings from "./components/auth/Settings";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { useContext } from "react";
import UserContext from "./context/UserContext";
import { useToast } from "./context/ToastContext";
import LogInHelp from './components/auth/LogInHelp';

// Public route guard - redirects to browse if already logged in
const PublicRoute = ({ children }) => {
    const { user, loading } = useContext(UserContext);
    const { showToast } = useToast();

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
                <p className="text-white text-lg">Loading...</p>
            </div>
        );
    }

    if (user) {
        showToast("You are already logged in", "info");
        return <Navigate to={ROUTES.BROWSE} replace />;
    }

    return children;
};

// Root route handler - redirects based on auth status
const RootRoute = () => {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
                <p className="text-white text-lg">Loading...</p>
            </div>
        );
    }

    return user ? <Navigate to={ROUTES.BROWSE} replace /> : <Navigate to={ROUTES.LOGIN} replace />;
};

const App = () => {
    return (
        <Router>
            <UserProvider>
                <ToastProvider>
                    <Routes>
                        {/* Public Routes - Redirect to browse if logged in */}
                        <Route
                            path={ROUTES.LOGIN}
                            element={
                                <PublicRoute>
                                    <Login defaultForm="signin" />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path={ROUTES.SIGN_UP}
                            element={
                                <PublicRoute>
                                    <Login defaultForm="signup" />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path={ROUTES.HELP}
                            element={
                                <PublicRoute>
                                    <LogInHelp />
                                </PublicRoute>
                            }
                        />

                        {/* Protected Routes - Require authentication */}
                        <Route
                            path={ROUTES.BROWSE}
                            element={
                                <ProtectedRoute>
                                    <Browse />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path={ROUTES.PROFILE}
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path={ROUTES.SETTINGS}
                            element={
                                <ProtectedRoute>
                                    <Settings />
                                </ProtectedRoute>
                            }
                        />

                        {/* Root Route - Redirect based on auth status */}
                        <Route path={ROUTES.HOME} element={<RootRoute />} />

                        {/* Catch all - Redirect to root */}
                        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
                    </Routes>
                </ToastProvider>
            </UserProvider>
        </Router>
    );
};

export default App;
