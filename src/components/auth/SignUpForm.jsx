import React, { useContext } from "react";
import UserContext from "../../context/UserContext";
import { useToast } from "../../context/ToastContext";

const SignUpForm = () => {
    const { userStatus, setUserStatus } = useContext(UserContext);
    const { showToast } = useToast();
    
    const toggleUserStatus = () => {
        setUserStatus(!userStatus);
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        showToast("This is a replica of the Netflix login page. It is for practice only—no actual sign-up occurs here.", "info");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
            style={{
                backgroundImage:
                    "url(https://assets.nflxext.com/ffe/siteui/vlv3/42a0bce6-fc59-4c1c-b335-7196a59ae9ab/web/IN-en-20250303-TRIFECTA-perspective_d5f81427-d6cf-412d-8e86-2315671b9be1_large.jpg)",
            }}
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Sign-Up Container */}
            <div className="bg-black/80 text-white w-[450px] p-8 rounded-lg shadow-lg relative z-10">
                <h1 className="text-[32px] font-bold mb-6">Sign Up</h1>

                <form className="flex flex-col space-y-4" onSubmit={handleSignUp}>
                    <input
                        type="text"
                        className="border border-gray-400 bg-gray-900 text-white px-4 py-3 rounded-sm w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter your name"
                    />
                    <input
                        type="text"
                        className="border border-gray-400 bg-gray-900 text-white px-4 py-3 rounded-sm w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Email or mobile number"
                    />
                    <input
                        type="password"
                        className="border border-gray-400 bg-gray-900 text-white px-4 py-3 rounded-sm w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Password"
                    />
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-sm w-full transition">
                        Sign Up
                    </button>
                </form>

                {/* Remember Me Section */}
                <div className="flex items-center mt-4">
                    <label className="flex items-center cursor-pointer">
                        <input className="h-5 w-5 mr-2" type="checkbox" />
                        <span>Remember me</span>
                    </label>
                </div>

                {/* Sign-In Link */}
                <div className="mt-6 text-gray-400">
                    Already have an account?{" "}
                    <span
                        className="font-bold hover:underline cursor-pointer"
                        onClick={toggleUserStatus}
                    >
                        Sign in now.
                    </span>
                </div>

                {/* Disclaimer */}
                <div className="mt-6 text-gray-400 text-sm">
                    This is a replica of the Netflix login page. It is for practice only—no actual sign-up occurs here.
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;
