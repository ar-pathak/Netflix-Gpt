import React, { useContext } from 'react'
import UserContext from '../../context/UserContext'


const UpdatePassword = () => {
    const { passwordComponent, setPasswordComponent } = useContext(UserContext)

    const togglePasswordComponent = () => {
        setPasswordComponent(!passwordComponent)
    }


    return (
        <div> <h1 className="text-[28px] text-[#333] font-semibold">
            Update password, email, or phone
        </h1>
            <p className="mt-2 text-[#333]">
                How would you like to reset your password?
            </p>

            {/* Radio Options */}
            <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                    <input
                        type="radio"
                        name="contactMethod"
                        id="email"
                        className="hidden peer"
                    />
                    <div className="w-5 h-5 border-2 border-gray-400 rounded-full peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-300 flex items-center justify-center transition">
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full opacity-0 peer-checked:opacity-100 transition"></div>
                    </div>
                    <label
                        htmlFor="email"
                        className="cursor-pointer text-gray-700 peer-checked:text-blue-600"
                    >
                        Email
                    </label>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="radio"
                        name="contactMethod"
                        id="textMessage"
                        className="hidden peer"
                    />
                    <div className="w-5 h-5 border-2 border-gray-400 rounded-full peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-300 flex items-center justify-center transition">
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full opacity-0 peer-checked:opacity-100 transition"></div>
                    </div>
                    <label
                        htmlFor="textMessage"
                        className="cursor-pointer text-gray-700 peer-checked:text-blue-600"
                    >
                        Text Message (SMS)
                    </label>
                </div>
            </div>

            {/* Email Input Section */}
            <div className="mt-6">
                <p className="text-[#333]">
                    We will send you an email with instructions on how to reset your
                    password.
                </p>
                <div className="mt-2">
                    <label htmlFor="emailInput" className="block text-gray-600 mb-1">
                        Email Address:
                    </label>
                    <input
                        type="email"
                        id="emailInput"
                        placeholder="name@example.com"
                        className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <button className="w-full bg-blue-600 text-white font-medium py-2 rounded-md mt-4 hover:bg-blue-700 transition">
                Email Me
            </button>

            {/* Additional Help Link */}
            <a
                href="#"
                className="block text-blue-600 text-sm mt-4 hover:underline"
                onClick={togglePasswordComponent}
            >
                I can't remember my email address or phone number.
            </a></div>
    )
}

export default UpdatePassword