import React, { useState } from 'react';
import './CurrentState.css';
import { leaveQueue } from '../../utils/api';

const CurrentState: React.FC = () => {
  // Accessing location/user ID information through local storage
  const location = localStorage.getItem('selectedLocation') || 'Cassie Campbell';
  const userID = localStorage.getItem('userID');
  // const nickname = localStorage.getItem('nickname');

  // Defining variables for active and queue players, and unsubscribe functions
  // const [activePlayers, setActivePlayers] = useState<string[]>([]);
  // const [queuePlayers, setQueuePlayers] = useState<string[]>([]);

  // Check if the user is in the queue (what if two users have the same nickname?)
  // const joined = activePlayers.concat(queuePlayers).includes(nickname);

  // Set the button to visible if the user is logged in and in the queue
  // const [leaveButtonVisible, setLeaveButtonVisible] = useState<boolean>(!!userID && joined);
  const [leaveButtonVisible, setLeaveButtonVisible] = useState<boolean>(!!userID);

  const handleLeaveQueue = async () => {
    try {
      const data = await leaveQueue(location, userID);

      if (data) {
        setLeaveButtonVisible(false);
        alert('You have successfully left the queue.');
      } else {
        alert('Failed to leave the queue. Please try again.');
      }
    } catch (error) {
      console.error('Error leaving queue:', error);
      alert('An error occurred. Please try again later.');
    }

  }

  return (
    <>
      <div className="current-state">
        {/* Player list */}
      </div>
      <div>
        {leaveButtonVisible && (
          <button className="leave-button" onClick={handleLeaveQueue}>
            Leave Queue
          </button>
        )}
      </div>
    </>
  );
};

export default CurrentState;