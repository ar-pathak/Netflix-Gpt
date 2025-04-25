import { useState, useRef, useEffect } from 'react';
import { auth } from '../../utils/firebase';
import { updateProfile, updateEmail } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { USER_AVATAR } from '../../utils/constants';
import { FaCamera, FaEdit, FaSave, FaTimes, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaArrowLeft, FaCheck, FaUser, FaEnvelope, FaPencilAlt, FaGlobe } from 'react-icons/fa';
import FormInput from '../common/FormInput';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
    const navigate = useNavigate();
    const user = auth.currentUser;
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.displayName || '',
        email: user?.email || '',
        photoURL: user?.photoURL || USER_AVATAR,
        bio: '',
        social: {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: ''
        }
    });
    const fileInputRef = useRef(null);
    const [photoHover, setPhotoHover] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');

    // Simulate loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 600);
        return () => clearTimeout(timer);
    }, [loading]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    photoURL: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile(auth.currentUser, {
                displayName: formData.name,
                photoURL: formData.photoURL
            });
            await updateEmail(auth.currentUser, formData.email);
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.message);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            name: user?.displayName || '',
            email: user?.email || '',
            photoURL: user?.photoURL || USER_AVATAR,
            bio: '',
            social: {
                facebook: '',
                twitter: '',
                instagram: '',
                linkedin: ''
            }
        });
    };

    const handleSocialChange = (platform, value) => {
        setFormData(prev => ({
            ...prev,
            social: {
                ...prev.social,
                [platform]: value
            }
        }));
    };

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: <FaUser /> },
        { id: 'social', label: 'Social Links', icon: <FaGlobe /> },
        { id: 'preferences', label: 'Preferences', icon: <FaPencilAlt /> }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900/20 to-black relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center mb-8"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center px-4 py-2 text-gray-400 hover:text-white transition-all rounded-full hover:bg-white/5 backdrop-blur-sm"
                    >
                        <FaArrowLeft className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                        <span>Back</span>
                    </button>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-gray-900/40 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10 transition-all duration-300"
                >
                    {/* Profile Header */}
                    <div className="relative h-60 bg-gradient-to-r from-blue-600/70 via-purple-600/70 to-pink-600/70">
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent"></div>
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
                        
                        <div className="absolute -bottom-20 left-0 w-full flex justify-center">
                            <motion.div 
                                className="relative group"
                                onMouseEnter={() => setPhotoHover(true)}
                                onMouseLeave={() => setPhotoHover(false)}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className={`w-40 h-40 rounded-full overflow-hidden ring-4 ${photoHover ? 'ring-blue-500' : 'ring-white/10'} transition-all duration-300 shadow-xl`}>
                                    <img
                                        src={formData.photoURL}
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {isEditing && (
                                    <motion.div 
                                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: photoHover ? 1 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <label className="cursor-pointer transform hover:scale-110 transition-transform">
                                            <FaCamera className="text-white text-2xl" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                className="hidden"
                                                ref={fileInputRef}
                                            />
                                        </label>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="pt-24 px-8 pb-8">
                        <div className="flex justify-between items-start mb-8">
                            <div className="text-center w-full">
                                <motion.h2 
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="text-3xl font-bold text-white mb-1"
                                >
                                    {formData.name}
                                </motion.h2>
                                <motion.p 
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="text-blue-400"
                                >
                                    {formData.email}
                                </motion.p>
                                <motion.div 
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                    className="mt-4"
                                >
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className={`relative inline-flex items-center px-6 py-2.5 rounded-full ${isEditing 
                                            ? 'bg-gradient-to-r from-red-500/80 to-red-600/80 text-white hover:from-red-500 hover:to-red-600' 
                                            : 'bg-gradient-to-r from-blue-500/80 to-indigo-600/80 text-white hover:from-blue-500 hover:to-indigo-600'
                                        } transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 backdrop-blur-sm`}
                                    >
                                        <span className="relative z-10 flex items-center">
                                            {isEditing ? (
                                                <>
                                                    <FaTimes className="mr-2" />
                                                    Cancel Editing
                                                </>
                                            ) : (
                                                <>
                                                    <FaEdit className="mr-2" />
                                                    Edit Profile
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </motion.div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-gray-800/80 mb-8">
                            <div className="flex flex-wrap">
                                {tabs.map(tab => (
                                    <motion.button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`group flex items-center px-6 py-4 text-sm font-medium transition-all relative ${
                                            activeTab === tab.id
                                                ? 'text-white'
                                                : 'text-gray-400 hover:text-white'
                                        }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span className={`mr-2 text-lg ${activeTab === tab.id ? 'text-blue-400' : 'text-gray-500 group-hover:text-blue-400'} transition-colors`}>
                                            {tab.icon}
                                        </span>
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <motion.span 
                                                className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                                                layoutId="tabIndicator"
                                            />
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.form 
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleUpdateProfile} 
                                className="space-y-8"
                            >
                                {activeTab === 'personal' && (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <motion.div 
                                                className="space-y-1"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: 0.1 }}
                                            >
                                                <label className="block text-blue-400 text-sm font-medium mb-1">Full Name</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        disabled={!isEditing}
                                                        className={`w-full bg-gray-800/30 backdrop-blur-sm text-white rounded-lg px-4 py-3 focus:outline-none ${isEditing ? 'focus:ring-2 focus:ring-blue-500 border border-gray-700' : 'border border-transparent'} disabled:opacity-60 transition-all`}
                                                        placeholder="John Doe"
                                                    />
                                                    {isEditing && <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <FaEdit className="text-blue-400 text-sm" />
                                                    </div>}
                                                </div>
                                            </motion.div>
                                            
                                            <motion.div 
                                                className="space-y-1"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: 0.2 }}
                                            >
                                                <label className="block text-blue-400 text-sm font-medium mb-1">Email Address</label>
                                                <div className="relative">
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        disabled={!isEditing}
                                                        className={`w-full bg-gray-800/30 backdrop-blur-sm text-white rounded-lg px-4 py-3 focus:outline-none ${isEditing ? 'focus:ring-2 focus:ring-blue-500 border border-gray-700' : 'border border-transparent'} disabled:opacity-60 transition-all`}
                                                        placeholder="email@example.com"
                                                    />
                                                    {isEditing && <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <FaEnvelope className="text-blue-400 text-sm" />
                                                    </div>}
                                                </div>
                                            </motion.div>
                                        </div>

                                        <motion.div 
                                            className="space-y-1"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: 0.3 }}
                                        >
                                            <label className="block text-blue-400 text-sm font-medium mb-1">Bio</label>
                                            <div className="relative">
                                                <textarea
                                                    value={formData.bio}
                                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                    disabled={!isEditing}
                                                    className={`w-full bg-gray-800/30 backdrop-blur-sm text-white rounded-lg px-4 py-3 focus:outline-none ${isEditing ? 'focus:ring-2 focus:ring-blue-500 border border-gray-700' : 'border border-transparent'} disabled:opacity-60 transition-all`}
                                                    rows="4"
                                                    placeholder="Tell us about yourself..."
                                                />
                                                {isEditing && <div className="absolute top-3 right-3">
                                                    <FaPencilAlt className="text-blue-400 text-sm" />
                                                </div>}
                                            </div>
                                        </motion.div>
                                    </>
                                )}

                                {activeTab === 'social' && (
                                    <motion.div 
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.div 
                                            className={`flex items-center ${isEditing ? 'bg-gray-800/30' : 'bg-gray-800/10'} backdrop-blur-sm rounded-lg p-3 border ${isEditing ? 'border-gray-700' : 'border-transparent'} transition-all`}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <FaFacebook className="text-blue-500 text-xl mr-3" />
                                            <input
                                                type="text"
                                                placeholder="Facebook URL"
                                                value={formData.social.facebook}
                                                onChange={(e) => handleSocialChange('facebook', e.target.value)}
                                                disabled={!isEditing}
                                                className="bg-transparent text-white w-full border-none focus:outline-none focus:ring-0 disabled:opacity-60"
                                            />
                                        </motion.div>
                                        <motion.div 
                                            className={`flex items-center ${isEditing ? 'bg-gray-800/30' : 'bg-gray-800/10'} backdrop-blur-sm rounded-lg p-3 border ${isEditing ? 'border-gray-700' : 'border-transparent'} transition-all`}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <FaTwitter className="text-blue-400 text-xl mr-3" />
                                            <input
                                                type="text"
                                                placeholder="Twitter URL"
                                                value={formData.social.twitter}
                                                onChange={(e) => handleSocialChange('twitter', e.target.value)}
                                                disabled={!isEditing}
                                                className="bg-transparent text-white w-full border-none focus:outline-none focus:ring-0 disabled:opacity-60"
                                            />
                                        </motion.div>
                                        <motion.div 
                                            className={`flex items-center ${isEditing ? 'bg-gray-800/30' : 'bg-gray-800/10'} backdrop-blur-sm rounded-lg p-3 border ${isEditing ? 'border-gray-700' : 'border-transparent'} transition-all`}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <FaInstagram className="text-pink-500 text-xl mr-3" />
                                            <input
                                                type="text"
                                                placeholder="Instagram URL"
                                                value={formData.social.instagram}
                                                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                                                disabled={!isEditing}
                                                className="bg-transparent text-white w-full border-none focus:outline-none focus:ring-0 disabled:opacity-60"
                                            />
                                        </motion.div>
                                        <motion.div 
                                            className={`flex items-center ${isEditing ? 'bg-gray-800/30' : 'bg-gray-800/10'} backdrop-blur-sm rounded-lg p-3 border ${isEditing ? 'border-gray-700' : 'border-transparent'} transition-all`}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <FaLinkedin className="text-blue-600 text-xl mr-3" />
                                            <input
                                                type="text"
                                                placeholder="LinkedIn URL"
                                                value={formData.social.linkedin}
                                                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                                                disabled={!isEditing}
                                                className="bg-transparent text-white w-full border-none focus:outline-none focus:ring-0 disabled:opacity-60"
                                            />
                                        </motion.div>
                                    </motion.div>
                                )}

                                {activeTab === 'preferences' && (
                                    <motion.div 
                                        className="space-y-6"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="p-6 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-white/5">
                                            <h3 className="text-white font-medium text-lg mb-4">Notification Preferences</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="text-white">Email Notifications</h4>
                                                        <p className="text-gray-400 text-sm">Receive updates via email</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" className="sr-only peer" />
                                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="text-white">Push Notifications</h4>
                                                        <p className="text-gray-400 text-sm">Receive push notifications</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" className="sr-only peer" />
                                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {isEditing && (
                                    <motion.div 
                                        className="flex justify-end space-x-4 pt-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.button
                                            type="button"
                                            onClick={handleCancel}
                                            className="px-6 py-2.5 rounded-full bg-gray-800/50 backdrop-blur-sm text-white hover:bg-gray-700/50 transition-all border border-gray-700 shadow-lg"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            type="submit"
                                            disabled={loading}
                                            className="relative px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {loading ? (
                                                <div className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Saving...
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <FaSave className="mr-2" />
                                                    Save Changes
                                                </div>
                                            )}
                                        </motion.button>
                                    </motion.div>
                                )}
                            </motion.form>
                        </AnimatePresence>
                    </div>
                </motion.div>
                
                {/* Accent elements */}
                <div className="absolute top-40 right-10 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute bottom-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>
            </div>
        </div>
    );
};

export default Profile; 