import React from "react";
import { NavLink } from "react-router";

const LoginNavbar = ({ value }) => {
  return (
    <nav className="absolute top-0 left-0 w-full flex justify-between items-center p-6">
      {/* Netflix Logo */}
      <div className="cursor-pointer z-10">
        <NavLink to="/">
          <img
            className="w-40"
            src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png"
            alt="Netflix Logo"
          />
        </NavLink>
      </div>

      {/* Sign-In/Sign-Up Button */}
      <NavLink to="/login">
        <button className="text-[#e50914] border border-[#e50914] px-6 py-2 font-bold rounded-sm hover:bg-[#e50914] hover:text-white transition">
          {value}
        </button>
      </NavLink>
    </nav>
  );
};

export default LoginNavbar;
