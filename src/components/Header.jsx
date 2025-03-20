import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import UserContext from '../context/UserContext';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { useToast } from '../context/ToastContext';
import { LOGO_URL, USER_AVATAR, ROUTES } from '../utils/constants';

const Header = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const { showToast } = useToast();

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

    return (
        <div className="absolute w-full px-8 py-2 bg-gradient-to-b from-black z-10 flex justify-between items-center">
            <Link to={ROUTES.HOME}>
                <img
                    className="w-44"
                    src={LOGO_URL}
                    alt="Netflix Logo"
                />
            </Link>
            {user && (
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <img
                            className="w-8 h-8 rounded cursor-pointer"
                            src={user.photoURL || USER_AVATAR}
                            alt="User Avatar"
                        />
                        <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-700 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="py-2">
                                <div className="px-4 py-2 text-sm text-gray-300">
                                    <div className="font-semibold">{user.displayName || 'User'}</div>
                                    <div className="text-xs text-gray-400 truncate">{user.email}</div>
                                </div>
                                <hr className="border-gray-700" />
                                <Link
                                    to={ROUTES.PROFILE}
                                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition"
                                >
                                    Account Settings
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;