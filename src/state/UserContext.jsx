import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

// Create the context
export const UserContext = createContext(null);

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // This will only subscribe once when the component mounts
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // null when not logged in
    });

    // Unsubscribe from the listener when unmounting
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
