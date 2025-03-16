import React, { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router";
import LoginNavbar from "./LoginNavbar";
import LoginFooter from "./LoginFooter";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import UserContext from "../../context/UserContext";
import { useToast } from "../../context/ToastContext";

const Login = ({ defaultForm = "signin" }) => {
    const { loggedInStatus } = useContext(UserContext);
    const { showToast } = useToast();
    const [userStatus, setUserStatus] = useState(defaultForm === "signin");
    const [isLoading, setIsLoading] = useState(true);

    // Update userStatus when defaultForm changes
    useEffect(() => {
        setUserStatus(defaultForm === "signin");
    }, [defaultForm]);

    // Handle authentication check
    useEffect(() => {
        let timeoutId;

        if (loggedInStatus !== null) {
            setIsLoading(false);
            if (loggedInStatus) {
                showToast("You are already logged in", "info");
            }
        } else {
            // Set a timeout to prevent infinite loading
            timeoutId = setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [loggedInStatus, showToast]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
                <p className="text-white text-lg">Loading...</p>
            </div>
        );
    }

    // Redirect logged-in users to browse page
    if (loggedInStatus) {
        return <Navigate to="/browse" replace />;
    }

    return (
        <div className="min-h-screen bg-black">
            <LoginNavbar />
            {userStatus ? 
                <SignInForm onToggleForm={setUserStatus} /> : 
                <SignUpForm onToggleForm={setUserStatus} />
            }
            <LoginFooter />
        </div>
    );
};

export default Login;
