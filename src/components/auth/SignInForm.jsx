import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useToast } from "../../context/ToastContext";
import FormInput from "../common/FormInput";
import { ROUTES, FIREBASE_ERROR_CODES, VALIDATION_MESSAGES, IMAGES } from "../../utils/constants";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";

const SignInForm = ({ onToggleForm }) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email) {
            newErrors.email = VALIDATION_MESSAGES.REQUIRED;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = VALIDATION_MESSAGES.INVALID_EMAIL;
        }

        if (!formData.password) {
            newErrors.password = VALIDATION_MESSAGES.REQUIRED;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            showToast('Please fix the errors in the form', 'error');
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            showToast('Signed in successfully!', 'success');
            navigate(ROUTES.BROWSE);
        } catch (error) {
            console.error('Sign in error:', error);
            const errorMessage = FIREBASE_ERROR_CODES[error.code] || 'An error occurred while signing in';
            showToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
        validateForm();
    };

    return (
        <div className="fixed inset-0 w-full h-full flex items-center justify-center overflow-y-auto py-8">
            {/* Background Image with Preload */}
            <div className="fixed inset-0 w-full h-full">
                <div 
                    className="absolute inset-0 w-full h-full bg-no-repeat bg-center bg-cover transition-opacity duration-300"
                    style={{ 
                        backgroundImage: `url(${IMAGES.AUTH_BACKGROUND})`,
                        backgroundColor: '#141414' // Netflix's background color as fallback
                    }}
                />
                <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
            </div>

            {/* Form Container */}
            <div className="relative z-10 bg-black/75 backdrop-blur-sm px-8 sm:px-16 py-12 rounded-lg w-full max-w-md mx-4 my-auto shadow-2xl">
                <h1 className="text-3xl font-bold text-white mb-8">Sign In</h1>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <FormInput
                            type="email"
                            name="email"
                            label="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            error={touched.email ? errors.email : ''}
                            disabled={loading}
                        />
                        <FormInput
                            type="password"
                            name="password"
                            label="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            error={touched.password ? errors.password : ''}
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
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>

                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-red-600 focus:ring-red-600"
                                />
                                <label htmlFor="remember" className="ml-2 text-gray-400">
                                    Remember me
                                </label>
                            </div>
                            <Link
                                to={ROUTES.HELP}
                                className="text-gray-400 hover:underline"
                            >
                                Need help?
                            </Link>
                        </div>
                        
                        <p className="text-gray-400 text-center">
                            New to Netflix?{' '}
                            <button
                                type="button"
                                onClick={() => onToggleForm()}
                                className="text-white hover:underline font-semibold"
                                disabled={loading}
                            >
                                Sign up now
                            </button>
                        </p>
                    </div>
                </form>

                {/* Disclaimer */}
                <p className="mt-8 text-gray-400 text-sm">
                    This page is protected by Google reCAPTCHA to ensure you're not a bot.
                </p>
            </div>
        </div>
    );
};

export default SignInForm;
