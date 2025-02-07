// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

// Create context with proper typing
export const AuthContext = createContext<User | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);  // Set user or null if signed out
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  return (
    <AuthContext.Provider value={currentUser}>
      {children}
    </AuthContext.Provider>
  );
};