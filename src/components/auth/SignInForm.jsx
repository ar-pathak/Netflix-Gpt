import React from "react";
import { useToast } from "../../context/ToastContext";
import FormInput from "../common/FormInput";
import useForm from "../../hooks/useForm";
import { validateSignInForm } from "../../utils/validation";
import { auth } from "../../utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router";

const SignInForm = ({ onToggleForm }) => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    
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
        handleSubmit
    } = useForm(initialValues, validateSignInForm);

    const onSubmit = async (formValues) => {
        try {
            await signInWithEmailAndPassword(
                auth,
                formValues.email,
                formValues.password
            );
            
            showToast("Signed in successfully!", "success");
            navigate("/browse");
        } catch (error) {
            console.error("Sign in error:", error);
            let errorMessage = "An error occurred during sign in.";
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = "No account found with this email.";
                    break;
                case 'auth/wrong-password':
                    errorMessage = "Incorrect password.";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "Invalid email address.";
                    break;
                default:
                    errorMessage = error.message;
            }
            
            showToast(errorMessage, "error");
        }
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

            {/* Sign-In Container */}
            <div className="bg-black/80 text-white w-[450px] p-8 rounded-lg shadow-lg relative z-10">
                <h1 className="text-[32px] font-bold mb-6">Sign In</h1>

                <form className="flex flex-col space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <FormInput
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Email or mobile number"
                        error={errors.email}
                        touched={touched.email}
                    />
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
                    <button 
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-sm w-full transition"
                    >
                        Sign In
                    </button>
                </form>

                {/* Remember Me Section */}
                <div className="flex items-center mt-4">
                    <label className="flex items-center cursor-pointer">
                        <input className="h-5 w-5 mr-2" type="checkbox" />
                        <span>Remember me</span>
                    </label>
                </div>

                {/* Sign-Up Link */}
                <div className="mt-6 text-gray-400">
                    New to Netflix?{" "}
                    <span
                        className="font-bold hover:underline cursor-pointer"
                        onClick={() => onToggleForm(false)}
                    >
                        Sign up now.
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SignInForm;
