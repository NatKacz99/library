import React, { createContext, useEffect, useState } from "react";
import { AuthService } from '../services/AuthService.js';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const storedUser = AuthService.getUser();
    setUser(storedUser);
    setLoading(false);
  }, []);

  const loginUser = (userData) => {
    AuthService.setUser(userData);
    setUser(userData);
  };

  const logoutUser = () => {
    AuthService.clearUser();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      loginUser, 
      logoutUser, 
      loading
    }}>
      {children}
    </UserContext.Provider>
  );
}