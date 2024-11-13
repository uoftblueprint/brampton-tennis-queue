import LocationSelection from "./LocationSelection/LocationSelection";
import { useState, useEffect } from "react";
import { getExpectedWaitTime } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Queue = () => {
  const [waitTime, setWaitTime] = useState<number | null>(null);
  const [isQueueFull, setIsQueueFull] = useState<boolean>(false);
  const selectedLocation = localStorage.getItem('selectedLocation');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWaitTime = async () => {
      try {
        const data = await getExpectedWaitTime(selectedLocation);
        setWaitTime(data.expectedWaitTime);
        
        // If wait time is 5 hours or more, mark the queue as full
        if (data.expectedWaitTime >= 5) {
          setIsQueueFull(true);
        }
      } catch (error) {
        console.error('Failed to fetch expected wait time:', error);
      }
    };

    if (selectedLocation) fetchWaitTime();
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

            {/* Button only redirects, as joining queue will happen in ActiveView */}
            <button onClick={() => navigate('/active-view')}>
              {waitTime === 0 ? 'Start Playing' : 'Join Queue'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Queue;