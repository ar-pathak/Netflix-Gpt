import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { auth } from '../../utils/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useToast } from '../../context/ToastContext';
import FormInput from '../common/FormInput';
import { ROUTES, VALIDATION_MESSAGES, IMAGES } from '../../utils/constants';

const LogInHelp = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [touched, setTouched] = useState(false);

    const validateEmail = () => {
        if (!email) {
            setError(VALIDATION_MESSAGES.REQUIRED);
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError(VALIDATION_MESSAGES.INVALID_EMAIL);
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateEmail()) {
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            showToast('Password reset email sent! Check your inbox.', 'success');
            // Navigate back to login page after successful send
            setTimeout(() => {
                navigate(ROUTES.LOGIN);
            }, 2000);
        } catch (error) {
            console.error('Password reset error:', error);
            const errorMessage = error.code === 'auth/user-not-found' 
                ? 'No account found with this email address' 
                : 'Failed to send reset email. Please try again.';
            showToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full flex items-center justify-center overflow-y-auto py-8">
            {/* Background Image */}
            <div className="fixed inset-0 w-full h-full">
                <div 
                    className="absolute inset-0 w-full h-full bg-no-repeat bg-center bg-cover transition-opacity duration-300"
                    style={{ 
                        backgroundImage: `url(${IMAGES.AUTH_BACKGROUND})`,
                        backgroundColor: '#141414'
                    }}
                />
                <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
            </div>

            {/* Form Container */}
            <div className="relative z-10 bg-black/75 backdrop-blur-sm px-8 sm:px-16 py-12 rounded-lg w-full max-w-md mx-4 my-auto shadow-2xl">
                <h1 className="text-3xl font-bold text-white mb-4">Forgot Password</h1>
                <p className="text-gray-400 mb-8">
                    We will send you an email with instructions on how to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <FormInput
                            type="email"
                            name="email"
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => {
                                setTouched(true);
                                validateEmail();
                            }}
                            error={touched ? error : ''}
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-4">
                        <button
                            type="submit"
                            className={`w-full py-3.5 rounded bg-red-600 text-white font-semibold text-lg
                                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700 transition-colors'}`}
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        <Link
                            to={ROUTES.LOGIN}
                            className="block text-center text-gray-400 hover:underline"
                        >
                            Back to Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LogInHelp; 