import { createContext } from "react";

const UserContext = createContext({
    loggedInStatus: false,
    changePasswordComponent: false
})

export default UserContext