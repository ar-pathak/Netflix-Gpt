import { createContext, useState, useEffect } from "react";
import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

const UserContext = createContext({
    loggedInStatus: false,
    changePasswordComponent: false,
    user: null
});

export const UserProvider = ({ children }) => {
    const [loggedInStatus, setLoggedInStatus] = useState(false);
    const [changePasswordComponent, setChangePasswordComponent] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedInStatus(true);
                setUser(user);
            } else {
                setLoggedInStatus(false);
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{
            loggedInStatus,
            setLoggedInStatus,
            changePasswordComponent,
            setChangePasswordComponent,
            user
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;