import React from "react";
import LoginNavbar from "./LoginNavbar";
import LoginFooter from "./LoginFooter";

const Login = () => {
    return (
        <div>
            <LoginNavbar />
            <div
                className="h-225 bg-cover flex items-center justify-center relative"
                style={{
                    backgroundImage:
                        "url(https://assets.nflxext.com/ffe/siteui/vlv3/42a0bce6-fc59-4c1c-b335-7196a59ae9ab/web/IN-en-20250303-TRIFECTA-perspective_d5f81427-d6cf-412d-8e86-2315671b9be1_large.jpg)",
                }}
            >
                {/* Overlay for Dark Effect */}
                <div className="absolute inset-0 bg-black/50"></div>

                {/* Login Box */}
                <div className="login-page bg-black/80 text-white w-[450px] h-[709px] flex items-center justify-center rounded-xl relative z-10 ">
                    <div className="login-container">
                        <h1 className="text-[43px] font-bold ">Sign In</h1>
                        <form className="flex flex-col space-y-4 mt-4">
                            <input type="text " className="border p-4 border-amber-50/40 rounded-sm w-[322px]" placeholder="Email or mobile number" />
                            <input type="text " className="border p-4 border-amber-50/40 rounded-sm w-[322px]" placeholder="Password" />
                            <button className="bg-[#e50914] text-white cursor-pointer p-4 font-bold rounded-sm w-[322px] mt-4">Sign In</button>
                        </form>
                        <div className="flex flex-col items-center mt-4">
                            <span>Or</span>
                            <button className="bg-gray-700/60 text-white cursor-pointer p-4 font-bold rounded-sm w-[322px] mt-4">Use a sign-in code</button>
                            <span className="cursor-pointer mt-4 hover:text-gray-400 underline underline-offset-1">Forget password?</span>
                        </div>
                        <div className="mt-4 flex align-center justify-start">
                            <div className="mt-4 flex items-center justify-start">
                                <label className="flex items-center cursor-pointer">
                                    <input className="h-5 w-5" type="checkbox" />
                                    <span className="ml-2">Remember me</span>
                                </label>
                            </div>

                        </div>
                        <div className="mt-4">
                            <span className="text-gray-400">New to Netflix?</span><span className="font-bold hover:underline hover:underline-offset-1 cursor-pointer">Sign up now.</span>
                        </div>
                        <div className="mt-4 w-80">
                            <span className="text-gray-400 ">This is a replica of the Netflix login page. It is for practice only—no actual login occurs here.</span>
                        </div>

                    </div>
                </div>
            </div>
            <LoginFooter />
        </div>
    );
};

export default Login;
