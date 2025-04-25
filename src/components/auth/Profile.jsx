import React, { useState, useRef } from 'react';
import { auth } from '../../utils/firebase';
import { updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaPencilAlt, FaGlobe, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaCamera, FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa';
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

    const storage = getStorage();

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
        // Validate social URLs
        const invalidSocials = Object.entries(formData.social).filter(([platform, url]) => !validateSocialUrl(url, platform));
        if (invalidSocials.length > 0) {
            toast.error(`Invalid ${invalidSocials[0][0]} URL format`);
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
            setTimeout(() => setLoading(false), 600);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
            {/* Content */}
            <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center mb-4 sm:mb-8"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-gray-400 hover:text-white transition-all rounded-lg hover:bg-gray-800 text-sm sm:text-base"
                    >
                        <FaArrowLeft className="mr-1.5 sm:mr-2" />
                        <span>Back</span>
                    </button>
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
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                                        </div>
                                    ) : (
                                        <img 
                                            src={formData.photoURL || 'https://via.placeholder.com/150'} 
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
                                        <input
                                            type="text"
                                            value={formData.displayName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                                            className="w-full bg-gray-800 text-white rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-700 text-sm sm:text-base"
                                        />
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
                                    <div className="flex items-center space-x-3 sm:space-x-4">
                                        <FaFacebook className="text-xl sm:text-2xl text-blue-500" />
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.social.facebook}
                                                onChange={(e) => setFormData(prev => ({ ...prev, social: { ...prev.social, facebook: e.target.value } }))}
                                                placeholder="Facebook profile URL"
                                                className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-600 text-sm sm:text-base"
                                            />
                                        ) : (
                                            <span className="text-sm sm:text-base text-gray-400">
                                                {formData.social.facebook || 'Not connected'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-3 sm:space-x-4">
                                        <FaTwitter className="text-xl sm:text-2xl text-blue-400" />
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.social.twitter}
                                                onChange={(e) => setFormData(prev => ({ ...prev, social: { ...prev.social, twitter: e.target.value } }))}
                                                placeholder="Twitter profile URL"
                                                className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-600 text-sm sm:text-base"
                                            />
                                        ) : (
                                            <span className="text-sm sm:text-base text-gray-400">
                                                {formData.social.twitter || 'Not connected'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-3 sm:space-x-4">
                                        <FaInstagram className="text-xl sm:text-2xl text-pink-500" />
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.social.instagram}
                                                onChange={(e) => setFormData(prev => ({ ...prev, social: { ...prev.social, instagram: e.target.value } }))}
                                                placeholder="Instagram profile URL"
                                                className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-600 text-sm sm:text-base"
                                            />
                                        ) : (
                                            <span className="text-sm sm:text-base text-gray-400">
                                                {formData.social.instagram || 'Not connected'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-3 sm:space-x-4">
                                        <FaLinkedin className="text-xl sm:text-2xl text-blue-600" />
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.social.linkedin}
                                                onChange={(e) => setFormData(prev => ({ ...prev, social: { ...prev.social, linkedin: e.target.value } }))}
                                                placeholder="LinkedIn profile URL"
                                                className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-600 text-sm sm:text-base"
                                            />
                                        ) : (
                                            <span className="text-sm sm:text-base text-gray-400">
                                                {formData.social.linkedin || 'Not connected'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="border-t border-gray-800 p-4 sm:p-6">
                        <AnimatePresence mode="wait">
                            {isEditing ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="flex space-x-3 sm:space-x-4"
                                >
                                    <motion.button
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 flex items-center justify-center py-2 sm:py-3 px-4 sm:px-6 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-all text-sm sm:text-base"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <FaTimes className="mr-1.5 sm:mr-2" />
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        onClick={handleUpdateProfile}
                                        disabled={loading}
                                        className="flex-1 flex items-center justify-center py-2 sm:py-3 px-4 sm:px-6 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all disabled:opacity-70 text-sm sm:text-base"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {loading ? (
                                            <div className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Saving...
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <FaCheck className="mr-1.5 sm:mr-2" />
                                                Save Changes
                                            </div>
                                        )}
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    onClick={() => setIsEditing(true)}
                                    className="w-full flex items-center justify-center py-2 sm:py-3 px-4 sm:px-6 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all text-sm sm:text-base"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FaPencilAlt className="mr-1.5 sm:mr-2" />
                                    Edit Profile
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile; 