import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import UserContext from '../../context/UserContext';
import { auth } from '../../utils/firebase';
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
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
    const hasProfileChanges = () => {
        return (
            formData.displayName !== user?.displayName ||
            formData.email !== user?.email
        );
    };

    // Check if profile form is valid
    const isProfileFormValid = () => {
        // Only check errors for profile fields
        const hasProfileErrors = errors.displayName || errors.email || 
            (formData.email !== user?.email && errors.currentPassword);
        
        if (hasProfileErrors) return false;
        if (!hasProfileChanges()) return false;
        if (formData.email !== user?.email && !formData.currentPassword) return false;
        return true;
    };

    // Check if password form is valid
    const isPasswordFormValid = () => {
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) return false;
        if (formData.newPassword !== formData.confirmPassword) return false;
        if (errors.newPassword || errors.confirmPassword) return false;
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
        if (!isPasswordFormValid()) {
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

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        if (!isProfileFormValid()) {
            showToast('Please fix the errors before submitting.', 'error');
            return;
        }

        setLoading(true);
        try {
            if (formData.email !== user.email) {
                await handleReauthenticate(formData.currentPassword);
            }

            const updates = [];

            if (formData.displayName !== user.displayName) {
                updates.push(updateProfile(auth.currentUser, {
                    displayName: formData.displayName
                }));
            }

            if (formData.email !== user.email) {
                updates.push(updateEmail(auth.currentUser, formData.email));
            }

            await Promise.all(updates);
            showToast('Profile updated successfully!', 'success');
            setIsEditing(false);
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                originalEmail: formData.email
            }));
            setTouched({});
            setErrors({});
        } catch (error) {
            console.error('Profile update error:', error);
            let errorMessage = 'An error occurred while updating your profile.';
            
            switch (error.code) {
                case 'auth/requires-recent-login':
                    errorMessage = 'Please sign in again to update your profile.';
                    break;
                case 'auth/email-already-in-use':
                    errorMessage = 'This email is already registered.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address.';
                    break;
                default:
                    if (error.message) errorMessage = error.message;
            }
            
            showToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

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
                            <form onSubmit={handleProfileUpdate} className="space-y-6">
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
                                    <button
                                        type="submit"
                                        className={`
                                            px-6 py-2 rounded transition
                                            ${!isProfileFormValid() 
                                                ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                                                : 'bg-red-600 hover:bg-red-700'}
                                        `}
                                        disabled={loading || !isProfileFormValid()}
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
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
                                    <p className="text-white">{user?.email}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Password Section */}
                    <div className="bg-gray-900 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Password</h2>
                            {!isChangingPassword && !isEditing && (
                                <button
                                    type="button"
                                    onClick={() => setIsChangingPassword(true)}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                                >
                                    Change Password
                                </button>
                            )}
                        </div>

                        {isChangingPassword ? (
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
                                    <button
                                        type="submit"
                                        className={`
                                            px-6 py-2 rounded transition
                                            ${!isPasswordFormValid() 
                                                ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                                                : 'bg-red-600 hover:bg-red-700'}
                                        `}
                                        disabled={loading || !isPasswordFormValid()}
                                    >
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <p className="text-gray-400">
                                ••••••••
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 