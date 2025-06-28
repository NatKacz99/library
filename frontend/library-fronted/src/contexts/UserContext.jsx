import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(undefined); 

  useEffect(() => {
    const token = localStorage.getItem("userData");
    if (token) {
      try {
        const parsedUser = JSON.parse(token);
        setUser(parsedUser);
      } catch (err) {
        console.error("User parsing error from localStorage:", err);
        setUser(null);
      }
    } else {
      setUser(null); 
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
