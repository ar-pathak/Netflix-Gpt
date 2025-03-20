import React, { useState } from 'react';
import LoginNavbar from './LoginNavbar';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import Footer from '../common/Footer';
import { APP_CONFIG } from '../../utils/constants';

const Login = () => {
    const [isSignIn, setIsSignIn] = useState(true);

    return (
        <div className="min-h-screen bg-black flex flex-col">
            {/* Background Image */}
            <div className="absolute inset-0 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/93da5c27-be66-427c-8b72-5cb39d275279/94eb5ad7-10d8-4cca-bf45-ac52e0a052c0/IN-en-20240226-popsignuptwoweeks-perspective_alpha_website_large.jpg')] bg-cover bg-center">
                <div className="absolute inset-0 bg-black bg-opacity-50" />
            </div>

            {/* Content */}
            <div className="relative flex-grow flex flex-col overflow-auto">
                <LoginNavbar />
                
                <div className="flex-1 flex items-center justify-center px-4 py-10 md:py-16">
                    <div className="bg-black bg-opacity-75 p-8 rounded-lg w-full max-w-md my-10">
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
            </div>
            
            {/* Use compact Footer component */}
            <div className="relative z-10 mt-auto">
                <Footer compact={true} />
            </div>
        </div>
    );
};

export default Login;
