import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import UserContext from '../../context/UserContext';
import { auth } from '../../utils/firebase';
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, sendEmailVerification } from 'firebase/auth';
import { useToast } from '../../context/ToastContext';
import FormInput from '../common/FormInput';
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
        <div className="min-h-screen bg-black text-white pt-20 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Account Settings</h1>
                    <button
                        onClick={() => navigate('/browse')}
                        className="text-gray-400 hover:text-white transition"
                    >
                        Back to Browse
                    </button>
                </div>

                {/* Show verification banner if email is not verified */}
                {user && !user.emailVerified && <EmailVerificationBanner />}

                <div className="space-y-6">
                    {/* Profile Section */}
                    <div className="bg-gray-900 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Profile Information</h2>
                            {!isEditing && !isChangingPassword && (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
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

                                <div className="flex justify-end gap-4 pt-4">
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
                                        className="text-gray-400 hover:text-white transition"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <div className="relative group">
                                        <button
                                            type="submit"
                                            className={`
                                                px-6 py-2 rounded transition
                                                ${!isFormValid() 
                                                    ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                                                    : 'bg-red-600 hover:bg-red-700'}
                                            `}
                                            disabled={loading || !isFormValid()}
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        {!isFormValid() && (
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-sm rounded-lg p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                {!user?.emailVerified ? (
                                                    <p>Please verify your email before making changes</p>
                                                ) : !hasChanges() ? (
                                                    <p>No changes have been made to save</p>
                                                ) : Object.keys(errors).length > 0 ? (
                                                    <p>Please fix the validation errors</p>
                                                ) : (formData.email !== user.email && !formData.currentPassword) ? (
                                                    <p>Current password required to change email</p>
                                                ) : (
                                                    <p>Please fill in all required fields</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-400">Display Name</label>
                                    <p className="text-white">{user?.displayName || 'Not set'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Email</label>
                                    <p className="text-white flex items-center gap-2">
                                        {user?.email}
                                        {user?.emailVerified ? (
                                            <span className="text-green-500 text-sm">(Verified)</span>
                                        ) : (
                                            <span className="text-red-500 text-sm">(Not Verified)</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Password Section */}
                    <div className="bg-gray-900 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Password</h2>
                            {!isChangingPassword && !isEditing && (
                                <div className="relative group">
                                    <button
                                        type="button"
                                        onClick={() => setIsChangingPassword(true)}
                                        className={`
                                            bg-red-600 text-white px-4 py-2 rounded transition
                                            ${!user?.emailVerified ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}
                                        `}
                                        disabled={!user?.emailVerified}
                                    >
                                        Change Password
                                    </button>
                                    {!user?.emailVerified && (
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-sm rounded-lg p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <p>Please verify your email before changing password</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {isChangingPassword && (
                            <form onSubmit={handlePasswordChange} className="space-y-6">
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

                                <div className="flex justify-end gap-4 pt-4">
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
                                        className="text-gray-400 hover:text-white transition"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <div className="relative group">
                                        <button
                                            type="submit"
                                            className={`
                                                px-6 py-2 rounded transition
                                                ${!isFormValid()
                                                    ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                                                    : 'bg-red-600 hover:bg-red-700'}
                                            `}
                                            disabled={loading || !isFormValid()}
                                        >
                                            {loading ? 'Updating...' : 'Update Password'}
                                        </button>
                                        {!isFormValid() && (
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-sm rounded-lg p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
    );
};

export default Profile; 