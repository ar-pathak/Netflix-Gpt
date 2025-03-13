import React, { useContext, useState } from "react";
import UserContext from "../../context/UserContext";
import { NavLink } from "react-router";
import { useToast } from "../../context/ToastContext";
import FormInput from "../common/FormInput";
import useForm from "../../hooks/useForm";
import { validateSignInForm } from "../../utils/validation";

const SignInForm = () => {
    const { userStatus, setUserStatus } = useContext(UserContext);
    const [signInCode, setSignInCode] = useState(false);
    const { showToast } = useToast();

    const initialValues = {
        email: '',
        password: ''
    };

    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm
    } = useForm(initialValues, validateSignInForm);

    const toggleUserStatus = () => {
        setUserStatus(!userStatus);
    };

    const useSignInCodeBtn = () => {
        setSignInCode(!signInCode);
        resetForm();
    };

    const onSubmit = (formValues) => {
        showToast("This is a replica of the Netflix login page. It is for practice only—no actual login occurs here.", "info");
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

            {/* Login Container */}
            <div className="bg-black/80 text-white w-[450px] p-8 rounded-lg shadow-lg relative z-10">
                <h1 className="text-[32px] font-bold mb-6 cursor-pointer" onClick={toggleUserStatus}>
                    Sign In
                </h1>

                <form className="flex flex-col space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <FormInput
                        type="text"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Email or mobile number"
                        error={errors.email}
                        touched={touched.email}
                    />

                    {signInCode ? (
                        <p className="text-center text-sm text-gray-400">
                            Message and data rates may apply.
                        </p>
                    ) : (
                        <FormInput
                            type="password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Password"
                            error={errors.password}
                            touched={touched.password}
                        />
                    )}

                    <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-sm w-full transition"
                    >
                        Sign In
                    </button>
                </form>

                {/* Alternate Sign-in Options */}
                <div className="flex flex-col items-center mt-4 space-y-4">
                    <span>Or</span>
                    <button
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-sm w-full transition"
                        onClick={useSignInCodeBtn}
                    >
                        {signInCode ? "Use password" : "Use a sign-in code"}
                    </button>
                    <span className="cursor-pointer hover:text-gray-400 underline underline-offset-1">
                        <NavLink to="/login/help">
                            {signInCode ? "Forgot email or phone number?" : "Forgot password?"}
                        </NavLink>
                    </span>
                </div>

                {/* Remember Me & Sign Up Section */}
                <div className="flex items-center justify-between mt-6">
                    <label className="flex items-center cursor-pointer">
                        <input className="h-5 w-5 mr-2" type="checkbox" />
                        <span>Remember me</span>
                    </label>
                    <span className="text-gray-400">
                        New to Netflix?{" "}
                        <span className="font-bold hover:underline cursor-pointer" onClick={toggleUserStatus}>
                            Sign up now.
                        </span>
                    </span>
                </div>

                {/* Disclaimer */}
                <div className="mt-6 text-gray-400 text-sm">
                    This is a replica of the Netflix login page. It is for practice only—no actual login occurs here.
                </div>
            </div>
        </div>
    );
};

export default SignInForm;
