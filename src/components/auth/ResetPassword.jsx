import React, { useContext } from "react";
import UserContext from "../../context/UserContext";

const ResetPassword = () => {
  const { passwordComponent, setPasswordComponent } = useContext(UserContext)

  const togglePasswordComponent = () => {
    setPasswordComponent(!passwordComponent)
  }
  return (
    <div className="flex items-center justify-center">
      <div className="px-8 py-4">
        <h1 className="text-[28px] font-semibold text-gray-800">Forgot Email/Password</h1>
        <p className="text-gray-600 mt-2">
          Please provide this information to help us find your account (all fields required):
        </p>

        {/* Input Fields */}
        <div className="mt-4 space-y-3">
          <label htmlFor="firstName" className="block">
            <span className="text-gray-700">First name on account</span>
            <input
              type="text"
              id="firstName"
              placeholder="Enter your first name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400 outline-none"
            />
          </label>

          <label htmlFor="lastName" className="block">
            <span className="text-gray-700">Last name on account</span>
            <input
              type="text"
              id="lastName"
              placeholder="Enter your last name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400 outline-none"
            />
          </label>

          <label htmlFor="cardNumber" className="block">
            <span className="text-gray-700">Credit or debit card number on file</span>
            <input
              type="text"
              id="cardNumber"
              placeholder="Enter your card number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400 outline-none"
            />
          </label>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
            Find Account
          </button>
          <button className="w-full bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 transition" onClick={togglePasswordComponent}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
