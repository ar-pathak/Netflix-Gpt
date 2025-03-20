import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import UserContext from '../../context/UserContext';
import { auth } from '../../utils/firebase';
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, sendEmailVerification } from 'firebase/auth';
import { useToast } from '../../context/ToastContext';
import FormInput from '../common/FormInput';
import Footer from '../common/Footer';
import { validateProfileForm } from '../../utils/validation';

const Profile = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [formData, setFormData] = useState({
        displayName: user?.displayName || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        originalEmail: user?.email || ''
    });

    // Check if profile form has any changes
    const hasChanges = () => {
        if (!user) return false;
        
        const hasDisplayNameChange = formData.displayName !== user.displayName;
        const hasEmailChange = formData.email !== user.email;
        const hasPasswordChange = formData.newPassword !== '';
        
        return hasDisplayNameChange || hasEmailChange || hasPasswordChange;
    };

    // Check if profile form is valid
    const isFormValid = () => {
        // If email is not verified, only allow display name changes
        if (!user?.emailVerified) {
            // For unverified users, only allow display name changes and ensure it's valid
            if (formData.email !== user.email || formData.newPassword) {
                return false;
            }
            return !errors.displayName && formData.displayName !== user.displayName;
        }

        // For verified users, check all validation rules
        if (Object.keys(errors).length > 0) return false;
        if (!hasChanges()) return false;

        // Require current password for email or password changes
        if ((formData.email !== user.email || formData.newPassword) && !formData.currentPassword) {
            return false;
        }

        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Only validate relevant fields based on the form being edited
        const fieldsToValidate = {
            ...formData,
            [name]: value
        };

        // If editing profile, only validate profile fields
        if (isEditing) {
            const validationErrors = validateProfileForm({
                displayName: fieldsToValidate.displayName,
                email: fieldsToValidate.email,
                currentPassword: formData.email !== user?.email ? fieldsToValidate.currentPassword : ''
            });
            setErrors(prev => ({
                ...prev,
                [name]: validationErrors[name]
            }));
        }
        // If changing password, only validate password fields
        else if (isChangingPassword) {
            const validationErrors = validateProfileForm({
                currentPassword: fieldsToValidate.currentPassword,
                newPassword: fieldsToValidate.newPassword,
                confirmPassword: fieldsToValidate.confirmPassword
            });
            setErrors(prev => ({
                ...prev,
                [name]: validationErrors[name]
            }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
        
        // Only validate relevant fields based on the form being edited
        if (isEditing) {
            const validationErrors = validateProfileForm({
                displayName: formData.displayName,
                email: formData.email,
                currentPassword: formData.email !== user?.email ? formData.currentPassword : ''
            });
            setErrors(prev => ({
                ...prev,
                [name]: validationErrors[name]
            }));
        } else if (isChangingPassword) {
            const validationErrors = validateProfileForm({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword
            });
            setErrors(prev => ({
                ...prev,
                [name]: validationErrors[name]
            }));
        }
    };

    const handleReauthenticate = async (currentPassword) => {
        const credential = EmailAuthProvider.credential(
            user.email,
            currentPassword
        );
        await reauthenticateWithCredential(user, credential);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!isFormValid()) {
            showToast('Please fix the errors before submitting.', 'error');
            return;
        }

        setLoading(true);
        try {
            await handleReauthenticate(formData.currentPassword);
            await updatePassword(auth.currentUser, formData.newPassword);
            
            showToast('Password updated successfully!', 'success');
            setIsChangingPassword(false);
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
            setTouched({});
            setErrors({});
        } catch (error) {
            console.error('Password update error:', error);
            let errorMessage = 'An error occurred while updating your password.';
            
            switch (error.code) {
                case 'auth/wrong-password':
                    errorMessage = 'Current password is incorrect.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'New password is too weak.';
                    break;
                default:
                    if (error.message) errorMessage = error.message;
            }
            
            showToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            setLoading(true);
            const validationErrors = validateProfileForm(formData, user.email);
            setErrors(validationErrors);

            if (Object.keys(validationErrors).length > 0) {
                showToast("Please fix the errors in the form.", "error");
                return;
            }

            // For unverified users, only allow display name updates
            if (!user.emailVerified && (formData.email !== user.email || formData.newPassword)) {
                showToast("Please verify your email before changing email or password.", "error");
                return;
            }

            // Handle display name update
            if (formData.displayName !== user.displayName) {
                await updateProfile(auth.currentUser, {
                    displayName: formData.displayName
                });
            }

            // For verified users, handle email and password updates
            if (user.emailVerified) {
                if (formData.email !== user.email || formData.newPassword) {
                    // Reauthenticate user before sensitive changes
                    const credential = EmailAuthProvider.credential(user.email, formData.currentPassword);
                    await reauthenticateWithCredential(auth.currentUser, credential);

                    // Update email if changed
                    if (formData.email !== user.email) {
                        await updateEmail(auth.currentUser, formData.email);
                    }

                    // Update password if provided
                    if (formData.newPassword) {
                        await updatePassword(auth.currentUser, formData.newPassword);
                    }
                }
            }

            showToast("Profile updated successfully!", "success");
            setIsEditing(false);
            setIsChangingPassword(false);
            // Reset form
            setFormData({
                displayName: user.displayName || '',
                email: user.email || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            if (error.code === 'auth/wrong-password') {
                showToast("Current password is incorrect.", "error");
            } else {
                showToast("Error updating profile. Please try again.", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSendVerification = async () => {
        try {
            setLoading(true);
            await sendEmailVerification(auth.currentUser);
            setVerificationSent(true);
            showToast("Verification email sent! Please check your inbox.", "success");
        } catch (error) {
            console.error("Error sending verification email:", error);
            showToast("Error sending verification email. Please try again later.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Email Verification Banner
    const EmailVerificationBanner = () => (
        <div className="bg-red-600/10 border border-red-600 rounded-lg p-4 mb-6">
            <div className="flex flex-col gap-2">
                <h3 className="text-red-500 font-semibold">Email Not Verified</h3>
                <p className="text-gray-300">
                    Please verify your email address to enable profile updates.
                </p>
                <button
                    onClick={handleSendVerification}
                    disabled={loading || verificationSent}
                    className={`self-start px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition
                        ${(loading || verificationSent) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Sending...' : 
                     verificationSent ? 'Verification Email Sent' : 
                     'Send Verification Email'}
                </button>
                {verificationSent && (
                    <p className="text-green-500 text-sm mt-2">
                        Verification email sent! Please check your inbox and refresh this page after verifying.
                    </p>
                )}
            </div>
        </div>
    );

    // Reset forms when switching modes
    useEffect(() => {
        if (!isEditing && !isChangingPassword) {
            setFormData({
                displayName: user?.displayName || '',
                email: user?.email || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
                originalEmail: user?.email || ''
            });
            setTouched({});
            setErrors({});
        }
    }, [isEditing, isChangingPassword, user]);

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col">
            <div className="flex-grow">
                {!user?.emailVerified && <EmailVerificationBanner />}
                <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                    {/* Header with avatar */}
                    <div className="mb-12 text-center">
                        <div className="relative mx-auto mb-6 w-24 h-24 rounded-full bg-gray-800 overflow-hidden border-4 border-red-600 shadow-lg">
                            {user?.photoURL ? (
                                <img 
                                    src={user.photoURL} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-4xl text-white bg-gradient-to-br from-red-600 to-purple-600">
                                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?'}
                                </div>
                            )}
                        </div>
                        <h1 className="text-3xl font-bold text-white">{user?.displayName || 'Your Account'}</h1>
                        <p className="text-gray-400 mt-2">{user?.email || ''}</p>
                        
                        <div className="mt-4 inline-flex">
                            <button
                                onClick={() => navigate('/browse')}
                                className="flex items-center text-gray-300 hover:text-white transition px-4 py-2"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Browse
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Sidebar - Navigation */}
                        <div className="hidden lg:block">
                            <div className="bg-gray-900 rounded-xl p-6 shadow-xl">
                                <h3 className="text-lg font-medium text-white mb-4">Account Settings</h3>
                                <ul className="space-y-2">
                                    <li className="text-red-500 border-l-4 border-red-500 pl-3 py-1">
                                        Profile Information
                                    </li>
                                    <li className="text-gray-400 hover:text-white pl-3 py-1 transition-colors duration-150">
                                        Subscription
                                    </li>
                                    <li className="text-gray-400 hover:text-white pl-3 py-1 transition-colors duration-150">
                                        Billing
                                    </li>
                                    <li className="text-gray-400 hover:text-white pl-3 py-1 transition-colors duration-150">
                                        Notifications
                                    </li>
                                    <li className="text-gray-400 hover:text-white pl-3 py-1 transition-colors duration-150">
                                        Privacy
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Main Content - Profile Section */}
                        <div className="lg:col-span-2">
                            <div className="space-y-6">
                                {/* Profile Section */}
                                <div className="bg-gray-900 rounded-xl p-8 shadow-xl">
                                    <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                                        <h2 className="text-xl font-semibold text-white flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                            Profile Information
                                        </h2>
                                        {!isEditing && !isChangingPassword && (
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(true)}
                                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition flex items-center shadow-lg"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit Profile
                                            </button>
                                        )}
                                    </div>

                                    {isEditing ? (
                                        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800/30 p-6 rounded-lg">
                                            <FormInput
                                                label="Display Name"
                                                type="text"
                                                name="displayName"
                                                value={formData.displayName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Enter your display name"
                                                error={touched.displayName ? errors.displayName : ''}
                                            />

                                            <FormInput
                                                label="Email"
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Enter your email"
                                                error={touched.email ? errors.email : ''}
                                            />

                                            {formData.email !== user?.email && (
                                                <FormInput
                                                    label="Current Password"
                                                    type="password"
                                                    name="currentPassword"
                                                    value={formData.currentPassword}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    placeholder="Enter current password to change email"
                                                    error={touched.currentPassword ? errors.currentPassword : ''}
                                                />
                                            )}

                                            <div className="flex justify-end gap-4 pt-4 border-t border-gray-700 mt-6">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            displayName: user?.displayName || '',
                                                            email: user?.email || '',
                                                            currentPassword: '',
                                                            originalEmail: user?.email || ''
                                                        }));
                                                        setTouched({});
                                                        setErrors({});
                                                    }}
                                                    className="text-gray-400 hover:text-white transition px-4 py-2 rounded-md border border-gray-700 hover:border-gray-500"
                                                    disabled={loading}
                                                >
                                                    Cancel
                                                </button>
                                                <div className="relative group">
                                                    <button
                                                        type="submit"
                                                        className={`
                                                            px-6 py-2 rounded-md transition flex items-center
                                                            ${!isFormValid() 
                                                                ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                                                                : 'bg-red-600 hover:bg-red-700 shadow-lg'}
                                                        `}
                                                        disabled={loading || !isFormValid()}
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                Save Changes
                                                            </>
                                                        )}
                                                    </button>
                                                    {!isFormValid() && (
                                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-800 text-white text-sm rounded-lg p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                                            {!user?.emailVerified ? (
                                                                <p>Please verify your email before making changes</p>
                                                            ) : !hasChanges() ? (
                                                                <p>No changes have been made to save</p>
                                                            ) : Object.keys(errors).length > 0 ? (
                                                                <p>Please fix the validation errors</p>
                                                            ) : formData.email !== user?.email && !formData.currentPassword ? (
                                                                <p>Current password is required to change email</p>
                                                            ) : (
                                                                <p>Please fill in all required fields</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </form>
                                    ) : !isChangingPassword ? (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-gray-800/30 p-4 rounded-lg">
                                                    <p className="text-gray-400 text-sm">Display Name</p>
                                                    <p className="text-white font-medium mt-1">{user?.displayName || '-'}</p>
                                                </div>
                                                <div className="bg-gray-800/30 p-4 rounded-lg">
                                                    <p className="text-gray-400 text-sm">Email</p>
                                                    <div className="flex items-center mt-1">
                                                        <p className="text-white font-medium">{user?.email || '-'}</p>
                                                        {user?.emailVerified ? (
                                                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                                <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                                Verified
                                                            </span>
                                                        ) : (
                                                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                                <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                                </svg>
                                                                Not Verified
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:justify-end gap-4 pt-4 border-t border-gray-800 mt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsChangingPassword(true)}
                                                    className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition flex items-center justify-center"
                                                >
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                    Change Password
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handlePasswordChange} className="space-y-6 bg-gray-800/30 p-6 rounded-lg">
                                            <div className="mb-6">
                                                <h3 className="text-lg font-medium text-white mb-2">Change Password</h3>
                                                <p className="text-gray-400 text-sm">Please provide your current password and a new secure password.</p>
                                            </div>

                                            <FormInput
                                                label="Current Password"
                                                type="password"
                                                name="currentPassword"
                                                value={formData.currentPassword}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Enter your current password"
                                                error={touched.currentPassword ? errors.currentPassword : ''}
                                            />

                                            <FormInput
                                                label="New Password"
                                                type="password"
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Enter new password"
                                                error={touched.newPassword ? errors.newPassword : ''}
                                            />

                                            <FormInput
                                                label="Confirm New Password"
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Confirm new password"
                                                error={touched.confirmPassword ? errors.confirmPassword : ''}
                                            />

                                            <div className="flex justify-end gap-4 pt-4 border-t border-gray-700 mt-6">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsChangingPassword(false);
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            currentPassword: '',
                                                            newPassword: '',
                                                            confirmPassword: ''
                                                        }));
                                                        setTouched({});
                                                        setErrors({});
                                                    }}
                                                    className="text-gray-400 hover:text-white transition px-4 py-2 rounded-md border border-gray-700 hover:border-gray-500"
                                                    disabled={loading}
                                                >
                                                    Cancel
                                                </button>
                                                <div className="relative group">
                                                    <button
                                                        type="submit"
                                                        className={`
                                                            px-6 py-2 rounded-md transition flex items-center
                                                            ${!isFormValid()
                                                                ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                                                                : 'bg-red-600 hover:bg-red-700 shadow-lg'}
                                                        `}
                                                        disabled={loading || !isFormValid()}
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Updating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                                </svg>
                                                                Update Password
                                                            </>
                                                        )}
                                                    </button>
                                                    {!isFormValid() && (
                                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-800 text-white text-sm rounded-lg p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                                            {!user?.emailVerified ? (
                                                                <p>Please verify your email before changing password</p>
                                                            ) : !formData.currentPassword ? (
                                                                <p>Current password is required</p>
                                                            ) : !formData.newPassword ? (
                                                                <p>New password is required</p>
                                                            ) : !formData.confirmPassword ? (
                                                                <p>Please confirm your new password</p>
                                                            ) : Object.keys(errors).length > 0 ? (
                                                                <p>Please fix the validation errors</p>
                                                            ) : (
                                                                <p>Please fill in all required fields</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer compact={true} />
        </div>
    );
};

export default Profile; 