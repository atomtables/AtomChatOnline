// UserContext.js
import {createContext, useContext, useState} from 'react';
import {useImmer} from "use-immer";

const NamesContext = createContext();

export const NamesProvider = ({children}) => {
    const [names, setNames] = useImmer([]);

    return (
        <NamesContext.Provider value={{names, setNames}}>
            {children}
        </NamesContext.Provider>
    );
};

export const useNames = () => {
    const context = useContext(NamesContext);
    if (!context) {
        throw new Error('useNames must be used within a NamesContext');
    }
    return context;
};
