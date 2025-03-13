import React from "react";
import { useToast } from "../../context/ToastContext";
import FormInput from "../common/FormInput";
import useForm from "../../hooks/useForm";
import { validateSignUpForm } from "../../utils/validation";
import { auth } from "../../utils/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router";

const SignUpForm = ({ onToggleForm }) => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    
    const initialValues = {
        name: '',
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
    } = useForm(initialValues, validateSignUpForm);

    const onSubmit = async (formValues) => {
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formValues.email,
                formValues.password
            );

            // Update user profile with name
            await updateProfile(userCredential.user, {
                displayName: formValues.name
            });

            showToast("Account created successfully!", "success");
            navigate("/browse");
        } catch (error) {
            console.error("Sign up error:", error);
            let errorMessage = "An error occurred during sign up.";
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = "This email is already registered.";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "Invalid email address.";
                    break;
                case 'auth/weak-password':
                    errorMessage = "Password should be at least 6 characters.";
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

            {/* Sign-Up Container */}
            <div className="bg-black/80 text-white w-[450px] p-8 rounded-lg shadow-lg relative z-10">
                <h1 className="text-[32px] font-bold mb-6">Sign Up</h1>

                <form className="flex flex-col space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <FormInput
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your name"
                        error={errors.name}
                        touched={touched.name}
                    />
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
                        onClick={() => onToggleForm(true)}
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
