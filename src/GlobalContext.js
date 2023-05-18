//Saves every change in our React app.
//for example buttpnclick
//we use it fot call functions in every change

import React, { createContext, useState } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [updateCounter, setUpdateCounter] = useState(0);

  const handleUpdate = () => {
    setUpdateCounter((prev) => prev + 1);
  };

  return (
    <GlobalContext.Provider value={{ updateCounter, handleUpdate }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
