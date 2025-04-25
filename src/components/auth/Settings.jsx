import React, { useState } from 'react';
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
        theme: 'dark',
        language: 'en',
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

    const handleThemeChange = (theme) => {
        setFormData(prev => ({ ...prev, theme }));
        // Implement theme change logic
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
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
            // Save settings to user profile or database
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
                    {/* Decorative Header */}
                    <div className="relative h-24 bg-gradient-to-r from-blue-600/70 via-purple-600/70 to-pink-600/70 flex items-end">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent"></div>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="relative z-10 w-full p-6"
                        >
                            <h1 className="text-3xl font-bold text-white">Settings</h1>
                        </motion.div>
                    </div>
                    
                    {/* Tabs */}
                    <div className="border-b border-gray-800/80">
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

                    {/* Content */}
                    <div className="p-6 md:p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                {activeTab === 'general' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <div className="p-6 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-white/5">
                                            <h3 className="text-white font-medium text-lg mb-4">Account Settings</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="text-white">Two-Factor Authentication</h4>
                                                        <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                                                    </div>
                                                    <button className="px-4 py-2 rounded-lg bg-blue-600/50 hover:bg-blue-600 transition-all text-white">
                                                        Enable
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="text-white">Account Deletion</h4>
                                                        <p className="text-gray-400 text-sm">Permanently delete your account</p>
                                                    </div>
                                                    <button className="px-4 py-2 rounded-lg bg-red-600/50 hover:bg-red-600 transition-all text-white">
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
                                        className="space-y-6"
                                    >
                                        <div className="p-6 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-white/5">
                                            <h3 className="text-white font-medium text-lg mb-4">Theme Preferences</h3>
                                            <div className="grid grid-cols-2 gap-6 max-w-md">
                                                <motion.button
                                                    onClick={() => handleThemeChange('dark')}
                                                    className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all ${
                                                        formData.theme === 'dark'
                                                            ? 'bg-gradient-to-br from-blue-900/70 to-gray-900 text-white ring-2 ring-blue-400/50'
                                                            : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800/70 hover:text-white'
                                                    } backdrop-blur-sm border border-white/5 shadow-lg hover:shadow-xl hover:-translate-y-0.5`}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FaMoon className={`text-3xl mb-3 ${formData.theme === 'dark' ? 'text-blue-400' : 'text-gray-500'}`} />
                                                    <span className="font-medium">Dark Theme</span>
                                                    {formData.theme === 'dark' && (
                                                        <motion.span 
                                                            className="absolute bottom-3 right-3 text-blue-400"
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
                                                    className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all ${
                                                        formData.theme === 'light'
                                                            ? 'bg-gradient-to-br from-blue-900/70 to-gray-900 text-white ring-2 ring-blue-400/50'
                                                            : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800/70 hover:text-white'
                                                    } backdrop-blur-sm border border-white/5 shadow-lg hover:shadow-xl hover:-translate-y-0.5`}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FaSun className={`text-3xl mb-3 ${formData.theme === 'light' ? 'text-yellow-400' : 'text-gray-500'}`} />
                                                    <span className="font-medium">Light Theme</span>
                                                    {formData.theme === 'light' && (
                                                        <motion.span 
                                                            className="absolute bottom-3 right-3 text-blue-400"
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
                                        className="space-y-6"
                                    >
                                        <div className="p-6 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-white/5">
                                            <h3 className="text-white font-medium text-lg mb-4">Language Selection</h3>
                                            <div className="max-w-md">
                                                <div className="relative group">
                                                    <select
                                                        value={formData.language}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                                                        className="w-full appearance-none bg-gray-800/50 backdrop-blur-sm text-white rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/5 transition-all hover:border-blue-500/30 shadow-inner group-hover:shadow-lg"
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
                                        className="space-y-6"
                                    >
                                        <div className="p-6 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-white/5">
                                            <h3 className="text-white font-medium text-lg mb-4">Notification Preferences</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-5 rounded-xl bg-gray-800/40 backdrop-blur-sm border border-white/5 hover:bg-gray-800/50 transition-all hover:border-white/10 hover:shadow-lg">
                                                    <div>
                                                        <h4 className="text-white font-medium text-lg">Email Notifications</h4>
                                                        <p className="text-gray-400 text-sm mt-1">Receive updates via email</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer" 
                                                            checked={formData.notifications.email}
                                                            onChange={() => handleNotificationChange('email')}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>
                                                <div className="flex items-center justify-between p-5 rounded-xl bg-gray-800/40 backdrop-blur-sm border border-white/5 hover:bg-gray-800/50 transition-all hover:border-white/10 hover:shadow-lg">
                                                    <div>
                                                        <h4 className="text-white font-medium text-lg">Push Notifications</h4>
                                                        <p className="text-gray-400 text-sm mt-1">Receive push notifications</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer" 
                                                            checked={formData.notifications.push}
                                                            onChange={() => handleNotificationChange('push')}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>
                                                <div className="flex items-center justify-between p-5 rounded-xl bg-gray-800/40 backdrop-blur-sm border border-white/5 hover:bg-gray-800/50 transition-all hover:border-white/10 hover:shadow-lg">
                                                    <div>
                                                        <h4 className="text-white font-medium text-lg">Recommendations</h4>
                                                        <p className="text-gray-400 text-sm mt-1">Get personalized movie recommendations</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer" 
                                                            checked={formData.notifications.recommendations}
                                                            onChange={() => handleNotificationChange('recommendations')}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
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
                                        className="space-y-6"
                                    >
                                        <div className="p-6 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-white/5">
                                            <h3 className="text-white font-medium text-lg mb-4">Privacy Settings</h3>
                                            <div className="space-y-4">
                                                <div className="p-5 rounded-xl bg-gray-800/40 backdrop-blur-sm border border-white/5 hover:bg-gray-800/50 transition-all hover:border-white/10 hover:shadow-lg">
                                                    <h4 className="text-white font-medium text-lg mb-3">Profile Visibility</h4>
                                                    <div className="relative group">
                                                        <select
                                                            value={formData.privacy.profileVisibility}
                                                            onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                                                            className="w-full appearance-none bg-gray-800/70 backdrop-blur-sm text-white rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/5 transition-all hover:border-blue-500/30 shadow-inner"
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
                                                <div className="flex items-center justify-between p-5 rounded-xl bg-gray-800/40 backdrop-blur-sm border border-white/5 hover:bg-gray-800/50 transition-all hover:border-white/10 hover:shadow-lg">
                                                    <div>
                                                        <h4 className="text-white font-medium text-lg">Show Activity</h4>
                                                        <p className="text-gray-400 text-sm mt-1">Display your watch history to others</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer" 
                                                            checked={formData.privacy.showActivity}
                                                            onChange={() => handlePrivacyChange('showActivity', !formData.privacy.showActivity)}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>
                                                <div className="flex items-center justify-between p-5 rounded-xl bg-gray-800/40 backdrop-blur-sm border border-white/5 hover:bg-gray-800/50 transition-all hover:border-white/10 hover:shadow-lg">
                                                    <div>
                                                        <h4 className="text-white font-medium text-lg">Show Watchlist</h4>
                                                        <p className="text-gray-400 text-sm mt-1">Display your watchlist to others</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer" 
                                                            checked={formData.privacy.showWatchlist}
                                                            onChange={() => handlePrivacyChange('showWatchlist', !formData.privacy.showWatchlist)}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
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
                                        className="space-y-6"
                                    >
                                        <div className="p-6 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-white/5">
                                            <h3 className="text-white font-medium text-lg mb-4">Security Settings</h3>
                                            <div className="space-y-5 max-w-lg">
                                                <div className="space-y-2">
                                                    <label className="block text-blue-400 text-sm font-medium">Current Password</label>
                                                    <input
                                                        type="password"
                                                        placeholder="Enter current password"
                                                        className="w-full bg-gray-800/40 backdrop-blur-sm text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/5 shadow-inner"
                                                    />
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <label className="block text-blue-400 text-sm font-medium">New Password</label>
                                                    <input
                                                        type="password"
                                                        placeholder="Enter new password"
                                                        className="w-full bg-gray-800/40 backdrop-blur-sm text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/5 shadow-inner"
                                                    />
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <label className="block text-blue-400 text-sm font-medium">Confirm New Password</label>
                                                    <input
                                                        type="password"
                                                        placeholder="Confirm new password"
                                                        className="w-full bg-gray-800/40 backdrop-blur-sm text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/5 shadow-inner"
                                                    />
                                                </div>
                                                
                                                <div className="p-5 mt-6 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-white/5">
                                                    <h3 className="text-white font-medium flex items-center text-sm">
                                                        <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                        Password Requirements
                                                    </h3>
                                                    <ul className="text-gray-400 text-sm mt-2 space-y-1 ml-7 list-disc">
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
                    <div className="border-t border-gray-800/50 p-6">
                        <motion.button
                            onClick={handleSaveSettings}
                            disabled={loading}
                            className="w-full flex items-center justify-center py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500/90 to-indigo-600/90 text-white hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 backdrop-blur-sm disabled:opacity-70 disabled:hover:translate-y-0"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving Changes...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <FaCheck className="mr-2" />
                                    Save Changes
                                </div>
                            )}
                        </motion.button>
                    </div>
                </motion.div>
                
                {/* Accent elements */}
                <div className="absolute top-40 right-10 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute bottom-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>
            </div>
        </div>
    );
};

export default Settings; 