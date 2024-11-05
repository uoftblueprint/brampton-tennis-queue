import React, { useEffect, useState, useRef } from 'react';
import { fetchCurrentState } from '../../utils/api';
import PlayerList from './PlayerList';

const CurrentState: React.FC = () => {
  // Defining constants for data threshold and polling time
  const DATA_THRESHOLD_TIME = 5 * 60 * 1000;  // 5 minutes
  const POLLING_TIME = 20 * 1000;  // 20 seconds

  // Accessing location/nickname information through local storage
  const location = localStorage.getItem('selectedLocation') || 'Cassie Campbell';
  const nickname = localStorage.getItem('nickname') || 'User';

  // Defining variables for active and queue players
  const [activePlayers, setActivePlayers] = useState([]);
  const [queuePlayers, setQueuePlayers] = useState([]);
  const intervalId = useRef(null);  // Use ref for polling interval ID

  // Defining use effect to sync data
  useEffect(() => {
    // Define async function to check for new data
    const checkAndFetchData = async () => {
      // Check for cached data
      const cachedPlayers = JSON.parse(localStorage.getItem('tennisQueue-playerData'));
      const cachedTimestamp = localStorage.getItem('tennisQueue-lastCheckTime');

      // Determine cache age
      const cacheAge = cachedTimestamp ? Date.now() - new Date(cachedTimestamp).getTime() : null;
      let updateRequired = true;  // Default to true to initiate fetch

      // Use cached data if it's within threshold
      if (cachedPlayers && cacheAge && cacheAge < DATA_THRESHOLD_TIME) {
        setActivePlayers(cachedPlayers.activePlayersList);
        setQueuePlayers(cachedPlayers.queuePlayersList);
        updateRequired = false;
      }

      // If the data is not fresh or if there's no cached data, fetch the current state
      if (updateRequired) {
        // Fetch current state from backend
        const fetchedData = await fetchCurrentState(location, cachedTimestamp);
        if (fetchedData && fetchedData.updateRequired) {
          // Update state with fetched data
          setActivePlayers(fetchedData.activePlayers);
          setQueuePlayers(fetchedData.queuePlayers);

          // Update local storage with new data and check timestamp
          localStorage.setItem('tennisQueue-playerData', JSON.stringify(
            { activePlayersList: fetchedData.activePlayers, queuePlayersList: fetchedData.queuePlayers }
          ));
        }
        localStorage.setItem('tennisQueue-lastCheckTime', new Date().toISOString());
      }
    };

    // Start polling when page active
    const startPolling = () => {
      intervalId.current = setInterval(checkAndFetchData, POLLING_TIME);
    };

    // Shut down polling when page inactive
    const stopPolling = () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };

    // Handle page activity status change and update polling process
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        startPolling();
      } else {
        stopPolling();
      }
    };

    // Initial check and set up visibility listener
    checkAndFetchData(); // Initial data fetch
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      stopPolling();
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