import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import UserContext from '../context/UserContext';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { useToast } from '../context/ToastContext';
import { LOGO_URL, USER_AVATAR, ROUTES } from '../utils/constants';
import { FaUserCircle, FaSignOutAlt, FaCog, FaChevronDown, FaSearch, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            showToast('Signed out successfully', 'success');
            navigate(ROUTES.HOME);
        } catch (error) {
            console.error('Sign out error:', error);
            showToast('Error signing out', 'error');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    return (
        <div className="fixed w-full px-4 sm:px-8 py-3 bg-gradient-to-b from-black to-transparent z-50 flex justify-between items-center">
            <Link to={ROUTES.HOME} className="flex items-center">
                <img
                    className="w-24 sm:w-32 md:w-44"
                    src={LOGO_URL}
                    alt="Netflix Logo"
                />
            </Link>
            
            {user && (
                <div className="flex items-center gap-4">
                    {/* Search Button */}
                    <button
                        onClick={() => setSearchOpen(!searchOpen)}
                        className="text-white hover:text-red-600 transition-colors p-2"
                        aria-label="Search"
                    >
                        <FaSearch className="w-5 h-5" />
                    </button>

                    {/* Search Bar */}
                    <AnimatePresence>
                        {searchOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="absolute top-0 left-0 w-full h-full bg-black/95 flex items-center px-4 sm:px-8"
                                ref={searchRef}
                            >
                                <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto flex items-center">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search for movies, TV shows..."
                                        className="w-full bg-gray-800 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        className="bg-red-600 text-white px-4 py-2 rounded-r-lg hover:bg-red-700 transition-colors"
                                    >
                                        Search
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSearchOpen(false)}
                                        className="ml-4 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <FaTimes className="w-5 h-5" />
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button 
                            className="flex items-center space-x-2 text-white focus:outline-none"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <div className="relative flex items-center group">
                                <img
                                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-transparent group-hover:border-red-600 object-cover transition-all"
                                    src={user.photoURL || USER_AVATAR}
                                    alt="User Avatar"
                                />
                                <div className="hidden md:flex flex-col ml-2">
                                    <span className="text-sm font-medium text-white">{user.displayName || 'User'}</span>
                                    <span className="text-xs text-gray-400 truncate max-w-[150px]">{user.email}</span>
                                </div>
                                <FaChevronDown className="ml-2 text-gray-400 transition-transform duration-200" 
                                    style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} 
                                />
                            </div>
                        </button>
                        
                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-10 overflow-hidden"
                                >
                                    <div className="p-3 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
                                        <div className="font-medium text-white">{user.displayName || 'User'}</div>
                                        <div className="text-xs text-gray-400 truncate">{user.email}</div>
                                    </div>
                                    
                                    <div className="py-1">
                                        <Link
                                            to={ROUTES.PROFILE}
                                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <FaUserCircle className="mr-2" /> Profile
                                        </Link>
                                        <Link
                                            to={ROUTES.SETTINGS}
                                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <FaCog className="mr-2" /> Settings
                                        </Link>
                                    </div>
                                    
                                    <div className="border-t border-gray-800">
                                        <button
                                            onClick={() => {
                                                handleSignOut();
                                                setDropdownOpen(false);
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
                                        >
                                            <FaSignOutAlt className="mr-2" /> Sign Out
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;