import React, { useContext, useState } from "react";
import LoginNavbar from "./LoginNavbar";
import LoginFooter from "./LoginFooter";
import UpdatePassword from "./UpdatePassword";
import ResetPassword from "./ResetPassword";
import UserContext from "../../context/UserContext";




const LogInHelp = () => {
    const changePasswordComponent = useContext(UserContext)
    const [passwordComponent, setPasswordComponent] = useState(changePasswordComponent)

    return (
        <div>
            <LoginNavbar value="Sign In" />
            <div
                className="flex flex-col items-center justify-center h-[750px] bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url(https://assets.nflxext.com/ffe/siteui/acquisition/login/login-the-crown_2-1500x1000.jpg)",
                }}
            >
                <div className="loginContainer bg-[#f3f3f3] w-[460px]  p-10 rounded-md shadow-md">
                    <UserContext.Provider value={{passwordComponent, setPasswordComponent}}>
                        {passwordComponent ? <UpdatePassword /> : <ResetPassword />}
                    </UserContext.Provider>
                </div>

                {/* Disclaimer */}
                <div className="text-center mt-6 text-gray-500 text-sm">
                    <p>
                        This is a replica of the Netflix login page. It is for practice
                        only—no actual login occurs here.
                    </p>
                </div>
            </div>
            <LoginFooter />
        </div>
    );
};

export default LogInHelp;
