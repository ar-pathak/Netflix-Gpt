import React from 'react';
import { Link } from 'react-router';
import { LOGO_URL, ROUTES } from '../../utils/constants';

const LoginNavbar = () => {
    return (
        <nav className="absolute w-full px-8 py-2 bg-gradient-to-b from-black z-10">
            <Link to={ROUTES.HOME}>
                <img
                    className="w-44"
                    src={LOGO_URL}
                    alt="Netflix Logo"
                />
            </Link>
        </nav>
    );
};

export default LoginNavbar;
