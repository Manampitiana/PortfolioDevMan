
import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    currentUser: {},
    setCurrentUser: () => {},
    userToken: null,
    setUserToken: () => {},
})

export const ContextProvider = ({ children }) => {
    //USER
    const [currentUser, _setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem('USER_DATA');
        return savedUser ? JSON.parse(savedUser) : {};
    });
    const setCurrentUser = (user) => {
        if (user && Object.keys(user).length > 0) {
            localStorage.setItem('USER_DATA', JSON.stringify(user));
        }else{
            localStorage.removeItem('USER_DATA');
        }
        _setCurrentUser(user);
    }

    //TOKEN
    const [userToken, _setUserToken] = useState(localStorage.getItem('ACCESS_TOKEN') || '');
    const setUserToken = (token) => {
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        }else{
            localStorage.removeItem('ACCESS_TOKEN');
        }
        _setUserToken(token);
    }

    return (
        <StateContext.Provider value={{
            currentUser,
            setCurrentUser,
            userToken,
            setUserToken,
        }}>
            {children}
        </StateContext.Provider>
    );
}

export const useStateContext = () => useContext(StateContext);


