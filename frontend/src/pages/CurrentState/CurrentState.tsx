import React, { useEffect, useState, useRef } from 'react';
import debounce from 'lodash.debounce';  // Debounce method
import { fetchCurrentState, subscribeToLocation } from '../../utils/api';
import PlayerList from './PlayerList';

const CurrentState: React.FC = () => {
  // Defining constant for cache expiry threshold
  const CACHE_EXPIRY_THRESHOLD = 60 * 1000;  // 60 seconds

  // Accessing location/nickname information through local storage
  const location = localStorage.getItem('selectedLocation') || 'Cassie Campbell';
  const nickname = localStorage.getItem('nickname') || 'User';

  // Defining variables for active and queue players, and unsubscribe functions
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
          // Start Firestore listener
          unsubscribeRef.current = subscribeToLocation(location, callCurrentState);
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

      localStorage.setItem('playerData', JSON.stringify({
        activePlayersList: activePlayersList,
        queuePlayersList: queuePlayersList
      }));
    };

    // Define the function to call the current state endpoint
    const callCurrentState = async () => {
      const cachedTimestamp = localStorage.getItem('lastCheckTime');
      const fetchedData = await fetchCurrentState(location, cachedTimestamp);
      localStorage.setItem('lastCheckTime', new Date().toISOString());
      if (fetchedData && fetchedData.updateRequired) {
        handleUpdate({ activePlayersList: fetchedData.activePlayers, queuePlayersList: fetchedData.queuePlayers });
      }
    };

    // Define the function to stop all update processes
    const stopUpdating = () => {
      // Stop Firestore listener
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }

      // Stop cache expiry timer
      if (scheduledUpdateRef.current) {
        clearTimeout(scheduledUpdateRef.current);
        scheduledUpdateRef.current = null;
      }
    };

    // On page render: load cached data, and handle update/cache expiry timer
    checkAndLoadCachedData();

    // Handle page activity status change and update listening process
    const handleVisibilityChange = debounce(() => {
      document.visibilityState === 'visible' ? checkAndLoadCachedData() : stopUpdating();
    }, 300);  // Debounce timer: 300ms

    // Setup visibility listener and cleanup on unmount
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      stopUpdating();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="current-state">
      <PlayerList activePlayers={activePlayers} queuePlayers={queuePlayers} />
    </div>
  );
};

export default CurrentState;