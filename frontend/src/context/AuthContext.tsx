// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { LocalStorageContext } from './LocalStorageContext';
import { fetchCurrentState } from '../utils/api';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  //const CACHE_EXPIRY_THRESHOLD = 60 * 1000;  // 60 seconds
  const CACHE_EXPIRY_THRESHOLD = 10 * 1000;  // For testing!
  
  if (!localStorage) {
    throw new Error('AuthProvider must be used within a LocalStorageProvider');
  }

  // In AuthContext.tsx, modify the onAuthStateChanged callback
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user || null);
      
      // Add console.log to debug
      console.log("Auth state changed - User:", user?.uid);
      
      // Update Firebase UID in localStorage
      if (user?.uid) {
        console.log("Setting Firebase UID in localStorage:", user.uid);
        localStorage.setFirebaseUID(user.uid);
      }

      // Check whether the user is part of the game and needs to be redirected back to active view
      const selectedLocation = localStorage.selectedLocation;
      const addedToGame = localStorage.addedToGame;
      // Before redirecting, ensure the user, location and added flag are set, and we are not already in active view
      if (user?.uid && selectedLocation && addedToGame && !window.location.href.includes('active-view')) {
        try {
          // Check whether the user exists in the current state of this location
          const cachedTimestamp = localStorage.playerDataLastUpdateTime;
          const cacheAge = cachedTimestamp ? Date.now() - new Date(cachedTimestamp).getTime() : null;
          if (cacheAge && cacheAge < CACHE_EXPIRY_THRESHOLD) {
            // Cache is valid, so we can use it
            console.log("Using cached data");
            const cachedData = localStorage.playerData;
            if (cachedData) {
              const parsedData = JSON.parse(cachedData);
              if (parsedData.activeFirebaseUIDs.includes(user.uid) || parsedData.queueFirebaseUIDs.includes(user.uid)) {
                // Redirect to active view
                console.log("Redirecting to active view");
                setLoading(false);
                navigate('/active-view');
              }
            }
          } else {
            // Cache is missing or outdated, so fetch current state
            console.log("Fetching current state");
            const fetchedData = await fetchCurrentState(selectedLocation);
            if (fetchedData.queueFirebaseUIDs.includes(user.uid) || fetchedData.activeFirebaseUIDs.includes(user.uid)) {
              // Redirect to active view
              console.log("Redirecting to active view");
              setLoading(false);
              navigate('/active-view');
            }
          }
        } catch (error) {
          console.error("Error fetching current state: ", error);
        }
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