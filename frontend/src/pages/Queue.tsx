import LocationSelection from "./LocationSelection/LocationSelection";
import { useState, useEffect } from "react";

const Queue = () => {
  const [waitTime, setWaitTime] = useState<number | null>(null);
  const [isQueueFull, setIsQueueFull] = useState<boolean>(false);
  const [buttonVisible, setButtonVisible] = useState<boolean>(true);
  const selectedLocation = localStorage.getItem('selectedLocation');

  useEffect(() => {
    const fetchQueueData = async () => {
      try {
        const response = await fetch(`/queueStatus?location=${selectedLocation}`);
        const data = await response.json();
        setWaitTime(data.waitTime); // Assuming the API returns waitTime in hours

        if (data.waitTime >= 5) {
          setIsQueueFull(true);
        }
      } catch (error) {
        console.error('Failed to fetch queue data:', error);
      }
    };

    fetchQueueData();
  }, [selectedLocation]);

  const handleJoinQueue = async () => {
    try {
      const response = await fetch('/joinQueue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: selectedLocation }),
      });

      if (response.ok) {
        setButtonVisible(false);
        alert('You have successfully joined the queue.');
      } else {
        alert('Failed to join the queue. Please try again.');
      }
    } catch (error) {
      console.error('Error joining queue:', error);
      alert('An error occurred. Please try again later.');
    }
  };
  
  return (
    <div>
      {/* Render the Location Selection component (already here)*/}
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

            {buttonVisible && (
              <button onClick={handleJoinQueue}>
                {waitTime === 0 ? 'Start Playing' : 'Join Queue'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Queue;