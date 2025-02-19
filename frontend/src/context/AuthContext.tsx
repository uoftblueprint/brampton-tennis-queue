// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { LocalStorageContext } from './LocalStorageContext';

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
  const [loading, setLoading] = useState(true);
  
  // Get LocalStorageContext
  const localStorage = useContext(LocalStorageContext);
  
  if (!localStorage) {
    throw new Error('AuthProvider must be used within a LocalStorageProvider');
  }

  // In AuthContext.tsx, modify the onAuthStateChanged callback
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
      
      // Add console.log to debug
      console.log("Auth state changed - User:", user?.uid);
      
      // Update Firebase UID in localStorage
      if (user?.uid) {
        console.log("Setting Firebase UID in localStorage:", user.uid);
        localStorage.setFirebaseUID(user.uid);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [localStorage]);
  
  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};