import React, { createContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userCT, setUser] = useState(null);
    const [userotp, setUserOtp] = useState(null);

    return <UserContext.Provider value={{ userCT, setUser, userotp, setUserOtp }}>{children}</UserContext.Provider>;
};

export default UserContext;
