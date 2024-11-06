import React, { useEffect, useState, useRef } from 'react';
import { fetchCurrentState, subscribeToCurrentState } from '../../utils/api';
import PlayerList from './PlayerList';

const CurrentState: React.FC = () => {
  // Defining constant for cache expiry threshold and update method
  const CACHE_EXPIRY_THRESHOLD = 60 * 1000;  // 60 seconds
  const POLLING_INTERVAL = 20 * 1000;  			 // 20 seconds
  const UPDATE_METHOD = 'LISTENER';  				 // Update method: POLLING or LISTENER

  // Accessing location/nickname information through local storage
  const location = localStorage.getItem('selectedLocation') || 'Cassie Campbell';
  const nickname = localStorage.getItem('nickname') || 'User';

  // Defining variables for active and queue players, and update unsubscribe function
  const [activePlayers, setActivePlayers] = useState<string[]>([]);
  const [queuePlayers, setQueuePlayers] = useState<string[]>([]);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const scheduledUpdateRef = useRef<(() => void) | null>(null);  // Cache expiry timer

  // Defining use effect to sync data
  useEffect(() => {
  	// Function to check and load data from cache
    const checkAndLoadCachedData = () => {
    	// Getting cached data
      const cachedPlayers = JSON.parse(localStorage.getItem('playerData'));
      const cachedTimestamp = localStorage.getItem('lastCheckTime');
      const cacheAge = cachedTimestamp ? Date.now() - new Date(cachedTimestamp).getTime() : null;

      // Use cached data by default
      if (cachedPlayers) {
        setActivePlayers(cachedPlayers.activePlayersList);
        setQueuePlayers(cachedPlayers.queuePlayersList);
      }

      // If data outdated, call update function
      if (!cacheAge || cacheAge >= CACHE_EXPIRY_THRESHOLD) {
      	if (UPDATE_METHOD === 'LISTENER') {
      		// Start Firestore listener
      		unsubscribeRef.current = subscribeToCurrentState(location, handleUpdate);
      	} else {
      		// Call current state for initial data
      		callCurrentState();
      		// Start polling interval
      		unsubscribeRef.current = setInterval(callCurrentState, POLLING_INTERVAL);
      	}
      } else {
      	// Start timer to check cache expiry if user stays on page
      	const timeTillCacheExpiry = CACHE_EXPIRY_THRESHOLD - cacheAge + 10;
      	scheduledUpdateRef.current = setTimeout(checkAndLoadCachedData, timeTillCacheExpiry);
      }
    };

    // Define the update handler for data changes
    const handleUpdate = ({ activePlayersList, queuePlayersList }) => {
      setActivePlayers(activePlayersList);
      setQueuePlayers(queuePlayersList);

      localStorage.setItem('playerData', JSON.stringify({ activePlayersList, queuePlayersList }));
      localStorage.setItem('lastCheckTime', new Date().toISOString());
    };

    // Define the function to call the current state endpoint
    const callCurrentState = async () => {
    	const cachedTimestamp = localStorage.getItem('lastCheckTime');
    	const fetchedData = await fetchCurrentState(location, cachedTimestamp);
      if (fetchedData && fetchedData.updateRequired) {
      	handleUpdate({ activePlayersList: fetchedData.activePlayers, queuePlayersList: fetchedData.queuePlayers });
      }
      localStorage.setItem('lastCheckTime', new Date().toISOString());
    }

    const stopUpdating = () => {
		  // Stop active data updates (listener or polling)
		  if (unsubscribeRef.current) {
		    if (UPDATE_METHOD === 'LISTENER') {
		      unsubscribeRef.current();  // unsubscribe listener
		    } else {
		      clearInterval(unsubscribeRef.current);  // clear polling interval
		    }
		    unsubscribeRef.current = null;
		  }

		  // Stop cache expiry timer
		  if (scheduledUpdateRef.current) {
		    clearTimeout(scheduledUpdateRef.current);  // clear scheduled refresh timeout
		    scheduledUpdateRef.current = null;
		  }
		};

    // On page render: load cached data, and call update method if cache beyond expiry threshold
    checkAndLoadCachedData();

    // Handle page activity status change and update listening process
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAndLoadCachedData();
      } else {
        stopUpdating();
      }
    };

    // Setup visibility listener and cleanup on unmount
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      stopUpdating();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location]);

  return (
    <div className="current-state">
      <PlayerList activePlayers={activePlayers} queuePlayers={queuePlayers} />
    </div>
  );
};

export default CurrentState;