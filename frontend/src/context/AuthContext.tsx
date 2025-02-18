// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

// Create interface for our context type
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

// Update context typing
export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);  // Add loading state

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
      setLoading(false);  // Set loading to false once we have the auth state
    });

    return () => unsubscribe();
  }, []);

  // Provide both user and loading state
  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};