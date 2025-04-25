import React, { useState, useEffect } from 'react';
import { auth } from '../../utils/firebase';
import { updateProfile } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import FormInput from '../common/FormInput';
import { FaMoon, FaSun, FaBell, FaLock, FaGlobe, FaUserShield, FaArrowLeft, FaCheck, FaCog, FaPalette, FaLanguage, FaShieldAlt, FaVolumeUp } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        theme: localStorage.getItem('theme') || 'dark',
        language: localStorage.getItem('language') || 'en',
        notifications: {
            email: true,
            push: true,
            recommendations: true
        },
        privacy: {
            profileVisibility: 'public',
            showActivity: true,
            showWatchlist: true
        }
    });

    useEffect(() => {
        // Load saved settings from user profile
        const loadSettings = async () => {
            try {
                const savedSettings = auth.currentUser?.metadata?.settings;
                if (savedSettings) {
                    const parsedSettings = JSON.parse(savedSettings);
                    setFormData(prev => ({
                        ...prev,
                        ...parsedSettings
                    }));
                }
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        };
        loadSettings();
    }, []);

    const handleThemeChange = (theme) => {
        setFormData(prev => ({ ...prev, theme }));
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    };

    const handleLanguageChange = (language) => {
        setFormData(prev => ({ ...prev, language }));
        localStorage.setItem('language', language);
    };

    const handleNotificationChange = (type) => {
        setFormData(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [type]: !prev.notifications[type]
            }
        }));
    };

    const handlePrivacyChange = (setting, value) => {
        setFormData(prev => ({
            ...prev,
            privacy: {
                ...prev.privacy,
                [setting]: value
            }
        }));
    };

    const handleSaveSettings = async () => {
        setLoading(true);
        try {
            await updateProfile(auth.currentUser, {
                metadata: {
                    settings: JSON.stringify(formData)
                }
            });
            toast.success('Settings saved successfully!');
            setTimeout(() => setLoading(false), 600);
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings');
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'general', label: 'General', icon: <FaCog /> },
        { id: 'appearance', label: 'Appearance', icon: <FaPalette /> },
        { id: 'language', label: 'Language', icon: <FaLanguage /> },
        { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
        { id: 'privacy', label: 'Privacy', icon: <FaLock /> },
        { id: 'security', label: 'Security', icon: <FaUserShield /> }
    ];

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
                    <div className="relative h-20 sm:h-24 bg-gradient-to-r from-gray-900 to-gray-800 flex items-end p-4 sm:p-6 border-b border-gray-800">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Settings</h1>
                    </div>
                    
                    {/* Tabs */}
                    <div className="border-b border-gray-800 overflow-x-auto">
                        <div className="flex flex-nowrap min-w-max">
                            {tabs.map(tab => (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`group flex items-center px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-medium transition-all relative ${
                                        activeTab === tab.id
                                            ? 'text-white'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className={`mr-1.5 sm:mr-2 text-base sm:text-lg ${activeTab === tab.id ? 'text-red-500' : 'text-gray-500 group-hover:text-red-500'} transition-colors`}>
                                        {tab.icon}
                                    </span>
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.span 
                                            className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-600 to-red-500"
                                            layoutId="tabIndicator"
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6 md:p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4 sm:space-y-8"
                            >
                                {activeTab === 'general' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4 sm:space-y-6"
                                    >
                                        <div className="p-4 sm:p-6 rounded-xl bg-gray-800 border border-gray-700">
                                            <h3 className="text-white font-medium text-base sm:text-lg mb-3 sm:mb-4">Account Settings</h3>
                                            <div className="space-y-3 sm:space-y-4">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                                    <div>
                                                        <h4 className="text-white text-sm sm:text-base">Two-Factor Authentication</h4>
                                                        <p className="text-gray-400 text-xs sm:text-sm">Add an extra layer of security</p>
                                                    </div>
                                                    <button className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all text-white text-sm sm:text-base">
                                                        Enable
                                                    </button>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                                    <div>
                                                        <h4 className="text-white text-sm sm:text-base">Account Deletion</h4>
                                                        <p className="text-gray-400 text-xs sm:text-sm">Permanently delete your account</p>
                                                    </div>
                                                    <button className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all text-white text-sm sm:text-base">
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'appearance' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4 sm:space-y-6"
                                    >
                                        <div className="p-4 sm:p-6 rounded-xl bg-gray-800 border border-gray-700">
                                            <h3 className="text-white font-medium text-base sm:text-lg mb-3 sm:mb-4">Theme Preferences</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-md">
                                                <motion.button
                                                    onClick={() => handleThemeChange('dark')}
                                                    className={`flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl transition-all ${
                                                        formData.theme === 'dark'
                                                            ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white ring-2 ring-red-500'
                                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                                    } border border-gray-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5`}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FaMoon className={`text-2xl sm:text-3xl mb-2 sm:mb-3 ${formData.theme === 'dark' ? 'text-red-500' : 'text-gray-500'}`} />
                                                    <span className="font-medium text-sm sm:text-base">Dark Theme</span>
                                                    {formData.theme === 'dark' && (
                                                        <motion.span 
                                                            className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-red-500"
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ type: "spring", stiffness: 500 }}
                                                        >
                                                            <FaCheck />
                                                        </motion.span>
                                                    )}
                                                </motion.button>
                                                <motion.button
                                                    onClick={() => handleThemeChange('light')}
                                                    className={`flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl transition-all ${
                                                        formData.theme === 'light'
                                                            ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white ring-2 ring-red-500'
                                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                                    } border border-gray-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5`}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FaSun className={`text-2xl sm:text-3xl mb-2 sm:mb-3 ${formData.theme === 'light' ? 'text-red-500' : 'text-gray-500'}`} />
                                                    <span className="font-medium text-sm sm:text-base">Light Theme</span>
                                                    {formData.theme === 'light' && (
                                                        <motion.span 
                                                            className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-red-500"
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ type: "spring", stiffness: 500 }}
                                                        >
                                                            <FaCheck />
                                                        </motion.span>
                                                    )}
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'language' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4 sm:space-y-6"
                                    >
                                        <div className="p-4 sm:p-6 rounded-xl bg-gray-800 border border-gray-700">
                                            <h3 className="text-white font-medium text-base sm:text-lg mb-3 sm:mb-4">Language Selection</h3>
                                            <div className="max-w-md">
                                                <div className="relative group">
                                                    <select
                                                        value={formData.language}
                                                        onChange={(e) => handleLanguageChange(e.target.value)}
                                                        className="w-full appearance-none bg-gray-700 text-white rounded-lg px-5 py-4 focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-600 transition-all hover:border-red-500"
                                                    >
                                                        <option value="en">English</option>
                                                        <option value="es">Español (Spanish)</option>
                                                        <option value="fr">Français (French)</option>
                                                        <option value="de">Deutsch (German)</option>
                                                        <option value="zh">中文 (Chinese)</option>
                                                        <option value="ja">日本語 (Japanese)</option>
                                                        <option value="ko">한국어 (Korean)</option>
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'notifications' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4 sm:space-y-6"
                                    >
                                        <div className="p-4 sm:p-6 rounded-xl bg-gray-800 border border-gray-700">
                                            <h3 className="text-white font-medium text-base sm:text-lg mb-3 sm:mb-4">Notification Preferences</h3>
                                            <div className="space-y-3 sm:space-y-4">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                                    <div>
                                                        <h4 className="text-white text-sm sm:text-base">Email Notifications</h4>
                                                        <p className="text-gray-400 text-xs sm:text-sm mt-1">Receive updates via email</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer" 
                                                            checked={formData.notifications.email}
                                                            onChange={() => handleNotificationChange('email')}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                                    </label>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                                    <div>
                                                        <h4 className="text-white text-sm sm:text-base">Push Notifications</h4>
                                                        <p className="text-gray-400 text-xs sm:text-sm mt-1">Receive push notifications</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer" 
                                                            checked={formData.notifications.push}
                                                            onChange={() => handleNotificationChange('push')}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                                    </label>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                                    <div>
                                                        <h4 className="text-white text-sm sm:text-base">Recommendations</h4>
                                                        <p className="text-gray-400 text-xs sm:text-sm mt-1">Get personalized movie recommendations</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer" 
                                                            checked={formData.notifications.recommendations}
                                                            onChange={() => handleNotificationChange('recommendations')}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'privacy' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4 sm:space-y-6"
                                    >
                                        <div className="p-4 sm:p-6 rounded-xl bg-gray-800 border border-gray-700">
                                            <h3 className="text-white font-medium text-base sm:text-lg mb-3 sm:mb-4">Privacy Settings</h3>
                                            <div className="space-y-3 sm:space-y-4">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                                    <div>
                                                        <h4 className="text-white text-sm sm:text-base">Profile Visibility</h4>
                                                        <p className="text-gray-400 text-xs sm:text-sm mt-1">Who can see your profile</p>
                                                    </div>
                                                    <div className="relative group">
                                                        <select
                                                            value={formData.privacy.profileVisibility}
                                                            onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                                                            className="w-full appearance-none bg-gray-600 text-white rounded-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-500 transition-all hover:border-red-500"
                                                        >
                                                            <option value="public">Public - Anyone can see your profile</option>
                                                            <option value="friends">Friends Only - Only connected friends</option>
                                                            <option value="private">Private - Only you</option>
                                                        </select>
                                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                                    <div>
                                                        <h4 className="text-white text-sm sm:text-base">Show Activity</h4>
                                                        <p className="text-gray-400 text-xs sm:text-sm mt-1">Display your watch history to others</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer" 
                                                            checked={formData.privacy.showActivity}
                                                            onChange={() => handlePrivacyChange('showActivity', !formData.privacy.showActivity)}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                                    </label>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                                    <div>
                                                        <h4 className="text-white text-sm sm:text-base">Show Watchlist</h4>
                                                        <p className="text-gray-400 text-xs sm:text-sm mt-1">Display your watchlist to others</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer" 
                                                            checked={formData.privacy.showWatchlist}
                                                            onChange={() => handlePrivacyChange('showWatchlist', !formData.privacy.showWatchlist)}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'security' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4 sm:space-y-6"
                                    >
                                        <div className="p-4 sm:p-6 rounded-xl bg-gray-800 border border-gray-700">
                                            <h3 className="text-white font-medium text-base sm:text-lg mb-3 sm:mb-4">Security Settings</h3>
                                            <div className="space-y-3 sm:space-y-5 max-w-lg">
                                                <div className="space-y-2">
                                                    <label className="block text-red-500 text-sm sm:text-base font-medium">Current Password</label>
                                                    <input
                                                        type="password"
                                                        placeholder="Enter current password"
                                                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-600 transition-all hover:border-red-500"
                                                    />
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <label className="block text-red-500 text-sm sm:text-base font-medium">New Password</label>
                                                    <input
                                                        type="password"
                                                        placeholder="Enter new password"
                                                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-600 transition-all hover:border-red-500"
                                                    />
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <label className="block text-red-500 text-sm sm:text-base font-medium">Confirm New Password</label>
                                                    <input
                                                        type="password"
                                                        placeholder="Confirm new password"
                                                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-600 transition-all hover:border-red-500"
                                                    />
                                                </div>
                                                
                                                <div className="p-5 mt-6 rounded-xl bg-gray-700 border border-gray-600">
                                                    <h3 className="text-white font-medium flex items-center text-sm sm:text-base">
                                                        <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                        Password Requirements
                                                    </h3>
                                                    <ul className="text-gray-400 text-sm sm:text-base mt-2 space-y-1 ml-7 list-disc">
                                                        <li>At least 8 characters</li>
                                                        <li>Include at least one uppercase letter</li>
                                                        <li>Include at least one number</li>
                                                        <li>Include at least one special character</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Save Button */}
                    <div className="border-t border-gray-800 p-4 sm:p-6">
                        <motion.button
                            onClick={handleSaveSettings}
                            disabled={loading}
                            className="w-full flex items-center justify-center py-2 sm:py-3 px-4 sm:px-6 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 text-sm sm:text-base"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving Changes...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <FaCheck className="mr-1.5 sm:mr-2" />
                                    Save Changes
                                </div>
                            )}
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Settings; 