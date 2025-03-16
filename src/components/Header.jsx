import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import UserContext from "../context/UserContext";
import { auth } from "../utils/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "../context/ToastContext";
import { IoMdArrowDropdown } from "react-icons/io";

const Header = () => {
    const { user, loggedInStatus } = useContext(UserContext);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            showToast("Signed out successfully!", "success");
            navigate("/login");
        } catch (error) {
            console.error("Sign out error:", error);
            showToast("Error signing out. Please try again.", "error");
        }
    };

    return (
        <header className="fixed w-full top-0 z-50 flex justify-between items-center px-8 py-4 bg-gradient-to-b from-black to-transparent">
            {/* Logo */}
            <img
                className="w-40 cursor-pointer"
                src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png"
                alt="Netflix Logo"
                onClick={() => navigate("/")}
            />

            {/* User Info & Actions */}
            <div className="flex items-center gap-4 relative">
                {loggedInStatus && user && (
                    <>
                        <div 
                            className="flex items-center gap-1 text-white cursor-pointer group"
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                        >
                            {/* User Avatar */}
                            <div className="w-8 h-8 rounded-md bg-red-600 flex items-center justify-center text-white font-bold">
                                {user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()}
                            </div>
                            <IoMdArrowDropdown className={`text-xl transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
                        </div>

                        {/* Profile Popup Menu */}
                        {showProfileMenu && (
                            <div className="absolute right-0 top-12 w-64 bg-black/90 border border-gray-700 rounded-md shadow-lg overflow-hidden">
                                {/* User Info Section */}
                                <div className="p-4 border-b border-gray-700">
                                    <p className="text-white font-medium">{user.displayName || 'Netflix User'}</p>
                                    <p className="text-gray-400 text-sm mt-1">{user.email}</p>
                                </div>

                                {/* Menu Items */}
                                <div className="py-2">
                                    <button 
                                        className="w-full px-4 py-2 text-left text-white hover:bg-gray-800 transition flex items-center gap-2"
                                        onClick={() => navigate('/profile')}
                                    >
                                        Account Settings
                                    </button>
                                    <button 
                                        className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-800 transition flex items-center gap-2"
                                        onClick={handleSignOut}
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
                {!loggedInStatus && (
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                        Sign In
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;