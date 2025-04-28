import React, { useState, useRef, useEffect } from 'react';
import { auth } from '../../utils/firebase';
import { updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaPencilAlt, FaGlobe, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaCamera, FaArrowLeft, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [formData, setFormData] = useState({
        displayName: auth.currentUser?.displayName || '',
        email: auth.currentUser?.email || '',
        photoURL: auth.currentUser?.photoURL || '',
        bio: auth.currentUser?.bio || '',
        social: {
            facebook: auth.currentUser?.social?.facebook || '',
            twitter: auth.currentUser?.social?.twitter || '',
            instagram: auth.currentUser?.social?.instagram || '',
            linkedin: auth.currentUser?.social?.linkedin || ''
        }
    });
    const [errors, setErrors] = useState({});
    const [originalData, setOriginalData] = useState(null);

    const storage = getStorage();

    useEffect(() => {
        if (isEditing) {
            setOriginalData(formData);
        }
    }, [isEditing]);

    const validateForm = () => {
        const newErrors = {};
        
        // Validate display name
        if (!formData.displayName.trim()) {
            newErrors.displayName = 'Display name is required';
        } else if (formData.displayName.length < 2) {
            newErrors.displayName = 'Display name must be at least 2 characters';
        }

        // Validate social URLs
        Object.entries(formData.social).forEach(([platform, url]) => {
            if (url && !validateSocialUrl(url, platform)) {
                newErrors[`social.${platform}`] = `Invalid ${platform} URL format`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        setUploadingPhoto(true);
        try {
            // Create a storage reference
            const storageRef = ref(storage, `profile-photos/${auth.currentUser.uid}/${file.name}`);
            
            // Upload the file
            await uploadBytes(storageRef, file);
            
            // Get the download URL
            const downloadURL = await getDownloadURL(storageRef);
            
            // Update form data with new photo URL
            setFormData(prev => ({ ...prev, photoURL: downloadURL }));
            
            // Update user profile
            await updateProfile(auth.currentUser, {
                photoURL: downloadURL
            });
            
            toast.success('Profile photo updated successfully!');
        } catch (error) {
            console.error('Error uploading photo:', error);
            toast.error('Failed to upload profile photo');
        } finally {
            setUploadingPhoto(false);
        }
    };

    const validateSocialUrl = (url, platform) => {
        if (!url) return true;
        const patterns = {
            facebook: /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9.]{5,}$/,
            twitter: /^(https?:\/\/)?(www\.)?twitter\.com\/[a-zA-Z0-9_]{1,15}$/,
            instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9._]{1,30}$/,
            linkedin: /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]{5,30}$/
        };
        return patterns[platform].test(url);
    };

    const handleUpdateProfile = async () => {
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setLoading(true);
        try {
            await updateProfile(auth.currentUser, {
                displayName: formData.displayName,
                photoURL: formData.photoURL,
                bio: formData.bio,
                social: formData.social
            });
            toast.success('Profile updated successfully!');
            setIsEditing(false);
            setErrors({});
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (originalData) {
            setFormData(originalData);
        }
        setIsEditing(false);
        setErrors({});
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
            {/* Content */}
            <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-between mb-4 sm:mb-8"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-gray-400 hover:text-white transition-all rounded-lg hover:bg-gray-800 text-sm sm:text-base"
                    >
                        <FaArrowLeft className="mr-1.5 sm:mr-2" />
                        <span>Back</span>
                    </button>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm sm:text-base"
                        >
                            <FaPencilAlt className="mr-1.5 sm:mr-2" />
                            <span>Edit Profile</span>
                        </button>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleCancel}
                                className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all text-sm sm:text-base"
                            >
                                <FaTimes className="mr-1.5 sm:mr-2" />
                                <span>Cancel</span>
                            </button>
                            <button
                                onClick={handleUpdateProfile}
                                disabled={loading}
                                className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <FaSpinner className="animate-spin mr-1.5 sm:mr-2" />
                                ) : (
                                    <FaCheck className="mr-1.5 sm:mr-2" />
                                )}
                                <span>Save Changes</span>
                            </button>
                        </div>
                    )}
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-800"
                >
                    {/* Header */}
                    <div className="relative h-36 sm:h-48 bg-gradient-to-r from-gray-900 to-gray-800 flex items-end p-4 sm:p-6 border-b border-gray-800">
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                        <div className="relative z-10 flex items-end space-x-4 sm:space-x-6">
                            <div className="relative group">
                                <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-gray-800 shadow-xl">
                                    {uploadingPhoto ? (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                            <FaSpinner className="animate-spin text-2xl text-red-500" />
                                        </div>
                                    ) : (
                                        <img 
                                            src={formData.photoURL || 'https://ui-avatars.com/api/?name=User&background=random'} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                {isEditing && (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                                        disabled={uploadingPhoto}
                                    >
                                        <FaCamera className="text-xl sm:text-2xl text-white" />
                                    </button>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handlePhotoChange}
                                    accept="image/*"
                                    className="hidden"
                                    disabled={uploadingPhoto}
                                />
                            </div>
                            <div className="pb-2 sm:pb-4">
                                <h1 className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
                                    {isEditing ? (
                                        <div>
                                            <input
                                                type="text"
                                                value={formData.displayName}
                                                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                                                className={`w-full bg-gray-800 text-white rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-red-500 border ${
                                                    errors.displayName ? 'border-red-500' : 'border-gray-700'
                                                } text-sm sm:text-base`}
                                            />
                                            {errors.displayName && (
                                                <p className="text-red-500 text-xs mt-1">{errors.displayName}</p>
                                            )}
                                        </div>
                                    ) : (
                                        formData.displayName || 'User'
                                    )}
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-400">{formData.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6 md:p-8">
                        <div className="space-y-4 sm:space-y-8">
                            {/* Bio Section */}
                            <div className="p-4 sm:p-6 rounded-xl bg-gray-800 border border-gray-700">
                                <h3 className="text-white font-medium text-base sm:text-lg mb-3 sm:mb-4">About Me</h3>
                                {isEditing ? (
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                        placeholder="Tell us about yourself..."
                                        className="w-full h-24 sm:h-32 bg-gray-700 text-white rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-600 resize-none text-sm sm:text-base"
                                    />
                                ) : (
                                    <p className="text-sm sm:text-base text-gray-400">
                                        {formData.bio || 'No bio added yet.'}
                                    </p>
                                )}
                            </div>

                            {/* Social Links */}
                            <div className="p-4 sm:p-6 rounded-xl bg-gray-800 border border-gray-700">
                                <h3 className="text-white font-medium text-base sm:text-lg mb-3 sm:mb-4">Social Links</h3>
                                <div className="space-y-3 sm:space-y-4">
                                    {Object.entries(formData.social).map(([platform, url]) => (
                                        <div key={platform} className="flex items-center space-x-3 sm:space-x-4">
                                            {platform === 'facebook' && <FaFacebook className="text-xl sm:text-2xl text-blue-500" />}
                                            {platform === 'twitter' && <FaTwitter className="text-xl sm:text-2xl text-blue-400" />}
                                            {platform === 'instagram' && <FaInstagram className="text-xl sm:text-2xl text-pink-500" />}
                                            {platform === 'linkedin' && <FaLinkedin className="text-xl sm:text-2xl text-blue-600" />}
                                            {isEditing ? (
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        value={url}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            social: { ...prev.social, [platform]: e.target.value }
                                                        }))}
                                                        placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} profile URL`}
                                                        className={`w-full bg-gray-700 text-white rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-red-500 border ${
                                                            errors[`social.${platform}`] ? 'border-red-500' : 'border-gray-600'
                                                        } text-sm sm:text-base`}
                                                    />
                                                    {errors[`social.${platform}`] && (
                                                        <p className="text-red-500 text-xs mt-1">{errors[`social.${platform}`]}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-sm sm:text-base text-gray-400">
                                                    {url || 'Not connected'}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile; 