import React from 'react'
import { IoLanguage } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";

function LoginFooter() {
    return (
        <div className='h-[312px] bg-black/90 text-white flex flex-col items-center justify-center'>
            <div className='w-9/12'>
                <div><span className='text-gray-300'>Questions? Call <a className='hover:underline hover:underline-offset-1' href="#">000-800-919-1743</a> (Toll-Free)</span></div>
            </div>
            <div className='w-9/12 mt-4'>
                <ul className='flex flex-wrap'>
                    <li className='w-2/8 mt-4'><a className='underline underline-offset-1 text-gray-300' href="#">FAQ</a></li>
                    <li className='w-2/8 mt-4'><a className='underline underline-offset-1 text-gray-300' href="#">Help Center</a></li>
                    <li className='w-2/8 mt-4'><a className='underline underline-offset-1 text-gray-300' href="#">Term of Use</a></li>
                    <li className='w-2/8 mt-4'><a className='underline underline-offset-1 text-gray-300' href="#">Privacy</a></li>
                    <li className='w-2/8 mt-4'><a className='underline underline-offset-1 text-gray-300' href="#">Cookie Preferences</a></li>
                    <li className='w-2/8 mt-4'><a className='underline underline-offset-1 text-gray-300' href="#">Corporate Information</a></li>
                </ul>
            </div>
            <div className='w-9/12 mt-4'>
                <div className="mt-4 flex items-center border border-amber-50 px-4 py-1 cursor-pointer rounded-md relative w-39">
                    <div className="flex items-center w-full">
                        <IoLanguage className="text-white mr-2" />
                        <span className="text-white">Language</span>
                        <MdKeyboardArrowDown className="text-white ml-auto" />
                    </div>
                    <select className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                        <option className="text-black">English</option>
                        <option className="text-black">हिन्दी</option>
                    </select>
                </div>

            </div>
        </div>
    )
}

export default LoginFooter  