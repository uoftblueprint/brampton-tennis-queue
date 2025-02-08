import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';  // Debounce method
import { fetchCurrentState, subscribeToLocation } from '../../utils/api';
import PlayerList from './PlayerList';
import { LocalStorageContext } from '../../context/LocalStorageContext';

//const CACHE_EXPIRY_THRESHOLD = 60 * 1000;  // 60 seconds
const CACHE_EXPIRY_THRESHOLD = 10 * 1000;  // For testing!

const CurrentState: React.FC = () => {
  const context = useContext(LocalStorageContext);

  const location = context.selectedLocation;
  const nickname = context.nickname;
  const firebaseUID = context.firebaseUID;
  
  const [activePlayers, setActivePlayers] = useState<string[]>([]);
  const [queuePlayers, setQueuePlayers] = useState<string[]>([]);
  const [activeFirebaseUIDs, setActiveFirebaseUIDs] = useState<string[]>([]);
  const [queueFirebaseUIDs, setQueueFirebaseUIDs] = useState<string[]>([]);
  const [inQueue, setInQueue] = useState<boolean>(context.inQueue);

  const unsubscribeRef = useRef<(() => void) | null>(null);  // Firestore listener cleanup
  const scheduledUpdateRef = useRef<(() => void) | null>(null);  // Cache expiry timer

  const navigate = useNavigate();

  // Function to check cache and load data
  const checkAndLoadCachedData = () => {
    const cachedPlayers = typeof context.playerData === 'string' && context.playerData.trim() !== ''
    ? JSON.parse(context.playerData)
    : {};
    const cachedTimestamp = context.playerDataLastUpdateTime;
    const cacheAge = cachedTimestamp ? Date.now() - new Date(cachedTimestamp).getTime() : null;
    const isInQueue = context.inQueue === 'true';
    setInQueue(isInQueue);

    // Use cached data if available
    if (cachedPlayers && cachedPlayers.activeNicknames && cachedPlayers.queueNicknames) {
      setActivePlayers(cachedPlayers.activeNicknames);
      setQueuePlayers(cachedPlayers.queueNicknames);
      setActiveFirebaseUIDs(cachedPlayers.activeFirebaseUIDs);
      setQueueFirebaseUIDs(cachedPlayers.queueFirebaseUIDs);
    }

    // Handle the case when cached data is missing or outdated
    if (!cacheAge) {
      // If not cached, start data fetch or listener based on in-queue status
      isInQueue ? startQueueListener() : updateUsingEndpoint();
    } else if (cacheAge >= CACHE_EXPIRY_THRESHOLD && isInQueue) {
      // Cache is outdated and the user is in queue
      startQueueListener();
    } else if (isInQueue) {
      // Cache is valid, but we set a timer to update
      const timeTillCacheExpiry = CACHE_EXPIRY_THRESHOLD - cacheAge + 10;
      scheduledUpdateRef.current = setTimeout(checkAndLoadCachedData, timeTillCacheExpiry);
    }
  };

  // Function to handle subscription for queue players
  const startQueueListener = () => {
    if (unsubscribeRef.current) return;
    unsubscribeRef.current = subscribeToLocation(location, updateState);
  };

  // Fetch current state data from endpoint
  const updateUsingEndpoint = async () => {
    const fetchedData = await fetchCurrentState(location);
    updateState(fetchedData);
  };

  // Handle changes in queue or active player state
  const updateState = (locationData: any) => {
    handleUpdate(locationData);
    updateInQueueStatus(locationData);
  };

  // Check if the user is still in queue or active
  const updateInQueueStatus = (locationData: any) => {
    const isInQueue = locationData.queueFirebaseUIDs.includes(firebaseUID);
    setInQueue(isInQueue);
    context.setInQueue(JSON.stringify(isInQueue));

    // If user is no longer in queue, stop updates
    if (!isInQueue) {
      stopUpdating();
    }
  };

  // Update player names to include '(you)'
  const updatePlayerNames = (locationData: any) => {
    const activeNicknames = [...locationData.activeNicknames];
    const queueNicknames = [...locationData.queueNicknames];

    locationData.activeFirebaseUIDs.forEach((playerUID: string, index: number) => {
      if (playerUID === firebaseUID) {
        activeNicknames[index] += ' (you)';
      }
    });

    locationData.queueFirebaseUIDs.forEach((playerUID: string, index: number) => {
      if (playerUID === firebaseUID) {
        queueNicknames[index] += ' (you)';
      }
    });

    return { activeNicknames, queueNicknames };
  };

  // Update the state with new player data
  const handleUpdate = (locationData: any) => {
    const { activeNicknames, queueNicknames } = updatePlayerNames(locationData);

    setActivePlayers(activeNicknames);
    setQueuePlayers(queueNicknames);
    setActiveFirebaseUIDs(locationData.activeFirebaseUIDs);
    setQueueFirebaseUIDs(locationData.queueFirebaseUIDs);

    context.setPlayerData(JSON.stringify({
      activeNicknames,
      queueNicknames,
      activeFirebaseUIDs: locationData.activeFirebaseUIDs,
      queueFirebaseUIDs: locationData.queueFirebaseUIDs,
    }));
    context.setPlayerDataLastUpdateTime(new Date().toISOString());
  };

  // Stop all active update processes (Firestore listener and cache timer)
  const stopUpdating = () => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    if (scheduledUpdateRef.current) {
      clearTimeout(scheduledUpdateRef.current);
      scheduledUpdateRef.current = null;
    }
  };

  // Debounce visibility change handler
  const handleVisibilityChange = debounce(() => {
    document.visibilityState === 'visible' ? checkAndLoadCachedData() : stopUpdating();
  }, 300);

  useEffect(() => {
    // On page load, check and load cached data
    checkAndLoadCachedData();

    // Set up visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup listener on unmount
    return () => {
      stopUpdating();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="current-state">
      <PlayerList
        activePlayers={activePlayers}
        queuePlayers={queuePlayers}
        activeFirebaseUIDs={activeFirebaseUIDs}
        queueFirebaseUIDs={queueFirebaseUIDs}
      />
    </div>
  );
};

export default CurrentState;