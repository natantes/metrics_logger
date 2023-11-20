import React, { createContext, useState } from "react";

export const UnitContext = createContext(null);

export const UnitProvider = ({ children }) => {
  const [unit, setUnit] = useState("kg");

  return (
    <UnitContext.Provider value={{ unit, setUnit }}>
      {children}
    </UnitContext.Provider>
  );
};
