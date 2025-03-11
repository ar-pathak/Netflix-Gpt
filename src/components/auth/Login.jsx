import React, { useState, useContext } from "react";
import LoginNavbar from "./LoginNavbar";
import LoginFooter from "./LoginFooter";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import UserContext from "../../context/UserContext";

const Login = () => {
    const loggedInStatus = useContext(UserContext)
    const [userStatus, setUserStatus] = useState(loggedInStatus)
    return (
        <div>
            <UserContext.Provider value={{ userStatus, setUserStatus }}>
                <LoginNavbar />
                {userStatus ? <SignInForm /> : <SignUpForm />}
                <LoginFooter />
            </UserContext.Provider>
        </div>
    );
};

export default Login;
