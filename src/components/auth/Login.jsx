import React, { useState } from "react";
import LoginNavbar from "./LoginNavbar";
import LoginFooter from "./LoginFooter";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

const Login = () => {
    const [userStatus, setUserStatus] = useState(true); // true for sign in, false for sign up

    return (
        <div>
            <LoginNavbar />
            {userStatus ? 
                <SignInForm onToggleForm={setUserStatus} /> : 
                <SignUpForm onToggleForm={setUserStatus} />
            }
            <LoginFooter />
        </div>
    );
};

export default Login;
