import LocationSelection from "./LocationSelection/LocationSelection";
import { useState, useEffect, useRef } from "react";
import { getExpectedWaitTime } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';

const Queue = () => {
  const [waitTime, setWaitTime] = useState<number | null>(null);
  const [isQueueFull, setIsQueueFull] = useState<boolean>(false);
  const selectedLocation = localStorage.getItem('selectedLocation');
  const navigate = useNavigate();
  const cacheExpiryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const CACHE_EXPIRY_THRESHOLD = 60 * 1000;

  useEffect(() => {
    // Function to fetch wait time and manage cache
    const fetchWaitTime = async () => {
      const cachedWaitTime = localStorage.getItem("expectedWaitTime");
      const lastCheckTime = localStorage.getItem("expectedWaitTimeLastCheckTime");
      const currentTime = Date.now();
      const cacheAge = lastCheckTime ? currentTime - parseInt(lastCheckTime) : null;

      // Use cached data if it's valid
      if (cachedWaitTime && cacheAge !== null && cacheAge < CACHE_EXPIRY_THRESHOLD) {
        const cachedTime = parseFloat(cachedWaitTime);
        setWaitTime(cachedTime);
        setIsQueueFull(cachedTime >= 2.5);

        // Schedule cache expiry if the user remains on the page
        const timeTillCacheExpiry = CACHE_EXPIRY_THRESHOLD - cacheAge + 10;
        cacheExpiryTimeoutRef.current = setTimeout(() => {
          localStorage.removeItem("expectedWaitTime");
          localStorage.removeItem("expectedWaitTimeLastCheckTime");
          if (selectedLocation) fetchWaitTime();
        }, timeTillCacheExpiry);
      } else {
        try {
          // Fetch updated data from API
          const data = await getExpectedWaitTime(selectedLocation);
          const expectedWaitTime = data.expectedWaitTime;

          setWaitTime(expectedWaitTime);
          setIsQueueFull(expectedWaitTime >= 2.5);

          // Cache the updated data
          localStorage.setItem("expectedWaitTime", expectedWaitTime.toString());
          localStorage.setItem("expectedWaitTimeLastCheckTime", currentTime.toString());

          // Schedule cache expiry
          cacheExpiryTimeoutRef.current = setTimeout(() => {
            localStorage.removeItem("expectedWaitTime");
            localStorage.removeItem("expectedWaitTimeLastCheckTime");
            if (selectedLocation) fetchWaitTime();
          }, CACHE_EXPIRY_THRESHOLD);
        } catch (error) {
          console.error("Failed to fetch expected wait time:", error);
        }
      }
    };

    // Function to stop cache expiry timer
    const stopUpdating = () => {
      if (cacheExpiryTimeoutRef.current) {
        clearTimeout(cacheExpiryTimeoutRef.current);
        cacheExpiryTimeoutRef.current = null;
      }
    };

    // Define a debounced visibility change handler
    const handleVisibilityChange = debounce(() => {
      if (document.visibilityState === 'visible') {
        if (selectedLocation) fetchWaitTime();  // Fetch data when page is visible
      } else {
        stopUpdating();   // Stop updates when page is hidden
      }
    }, 300);

    // Fetch wait time if a location is selected
    if (selectedLocation) fetchWaitTime();

    // Setup visibility listener and cleanup on unmount
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      stopUpdating();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [selectedLocation]);
  
  return (
    <div>
      {/* Render the Location Selection component*/}
      <LocationSelection />

      <div className="queue-info">
        <h3>Queue Status for {selectedLocation}</h3>
        
        {isQueueFull ? (
          <p>The queue is full. Please try again later.</p>
        ) : (
          <>
            {waitTime !== null && (
              <p>
                {waitTime === 0
                  ? 'There is no wait time. You can start playing immediately!'
                  : `Estimated wait time: ${waitTime} hour(s)`}
              </p>
            )}

            <button onClick={() => navigate('/user-info')}>
              {waitTime === 0 ? 'Start Playing' : 'Join Queue'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Queue;