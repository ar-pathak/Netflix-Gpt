import React, { useState } from 'react';
import LoginNavbar from './LoginNavbar';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { APP_CONFIG } from '../../utils/constants';

const Login = () => {
    const [isSignIn, setIsSignIn] = useState(true);

    return (
        <div className="min-h-screen bg-black">
            {/* Background Image */}
            <div className="absolute inset-0 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/93da5c27-be66-427c-8b72-5cb39d275279/94eb5ad7-10d8-4cca-bf45-ac52e0a052c0/IN-en-20240226-popsignuptwoweeks-perspective_alpha_website_large.jpg')] bg-cover bg-center">
                <div className="absolute inset-0 bg-black bg-opacity-50" />
            </div>

            {/* Content */}
            <div className="relative min-h-screen flex flex-col">
                <LoginNavbar />
                
                <div className="flex-1 flex items-center justify-center px-4">
                    <div className="bg-black bg-opacity-75 p-8 rounded-lg w-full max-w-md">
                        <h1 className="text-white text-3xl font-bold mb-8">
                            {isSignIn ? 'Sign In' : 'Sign Up'}
                        </h1>

                        {isSignIn ? (
                            <SignInForm onToggleForm={() => setIsSignIn(false)} />
                        ) : (
                            <SignUpForm onToggleForm={() => setIsSignIn(true)} />
                        )}
                    </div>
                </div>

                {/* Footer */}
                <footer className="relative py-4 text-center text-gray-500 text-sm">
                    {APP_CONFIG.FOOTER_TEXT}
                </footer>
            </div>
        </div>
    );
};

export default Login;
