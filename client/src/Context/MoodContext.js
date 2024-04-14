import React, { createContext, useState, useContext } from 'react';

const MoodContext = createContext();

export const useMood = () => useContext(MoodContext);

export const MoodProvider = ({ children }) => {
    const [mood, setMood] = useState('angry');  // Initialize with a default value if necessary

    return (
        <MoodContext.Provider value={{ mood, setMood }}>
            {children}
        </MoodContext.Provider>
    );
};
