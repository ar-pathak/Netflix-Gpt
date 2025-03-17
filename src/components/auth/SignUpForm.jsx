import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import FormInput from "../common/FormInput";
import { auth } from "../../utils/firebase";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router";
import { ROUTES, FIREBASE_ERROR_CODES, VALIDATION_MESSAGES, PASSWORD_RULES, IMAGES } from '../../utils/constants';

const SignUpForm = ({ onToggleForm }) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.displayName) {
            newErrors.displayName = VALIDATION_MESSAGES.REQUIRED;
        } else if (formData.displayName.length < 2) {
            newErrors.displayName = VALIDATION_MESSAGES.INVALID_NAME;
        }

        if (!formData.email) {
            newErrors.email = VALIDATION_MESSAGES.REQUIRED;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = VALIDATION_MESSAGES.INVALID_EMAIL;
        }

        if (!formData.password) {
            newErrors.password = VALIDATION_MESSAGES.REQUIRED;
        } else {
            if (formData.password.length < PASSWORD_RULES.MIN_LENGTH) {
                newErrors.password = `Password must be at least ${PASSWORD_RULES.MIN_LENGTH} characters`;
            }
            if (!PASSWORD_RULES.UPPERCASE.test(formData.password)) {
                newErrors.password = 'Password must contain at least one uppercase letter';
            }
            if (!PASSWORD_RULES.LOWERCASE.test(formData.password)) {
                newErrors.password = 'Password must contain at least one lowercase letter';
            }
            if (!PASSWORD_RULES.NUMBER.test(formData.password)) {
                newErrors.password = 'Password must contain at least one number';
            }
            if (!PASSWORD_RULES.SPECIAL_CHAR.test(formData.password)) {
                newErrors.password = 'Password must contain at least one special character';
            }
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = VALIDATION_MESSAGES.REQUIRED;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = VALIDATION_MESSAGES.PASSWORD_MISMATCH;
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
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            await updateProfile(userCredential.user, {
                displayName: formData.displayName
            });

            await sendEmailVerification(userCredential.user);

            showToast('Account created successfully! Please verify your email.', 'success');
            navigate(ROUTES.BROWSE);
        } catch (error) {
            console.error('Sign up error:', error);
            const errorMessage = FIREBASE_ERROR_CODES[error.code] || 'An error occurred while signing up';
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

        // Validate the field on blur
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
                        backgroundColor: '#141414'
                    }}
                />
                <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
            </div>

            {/* Form Container */}
            <div className="relative z-10 bg-black/75 backdrop-blur-sm px-8 sm:px-16 py-12 rounded-lg w-full max-w-md mx-4 my-auto shadow-2xl">
                <h1 className="text-3xl font-bold text-white mb-8">Create Account</h1>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                    <FormInput
                        type="text"
                            name="displayName"
                            label="Name"
                            value={formData.displayName}
                            onChange={handleInputChange}
                        onBlur={handleBlur}
                            error={touched.displayName ? errors.displayName : ''}
                            disabled={loading}
                    />
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
                            showPasswordRequirements={true}
                        />
                        <FormInput
                            type="password"
                            name="confirmPassword"
                            label="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                        onBlur={handleBlur}
                            error={touched.confirmPassword ? errors.confirmPassword : ''}
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
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                        
                        <p className="text-gray-400 text-center">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => onToggleForm()}
                                className="text-white hover:underline font-semibold"
                                disabled={loading}
                            >
                                Sign in now
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

export default SignUpForm;
