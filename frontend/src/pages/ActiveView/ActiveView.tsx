import React, { useEffect, useState } from 'react';
import './ActiveView.css';
import { leaveQueue } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import CurrentState from './CurrentState';

const ActiveView: React.FC = () => {
  // Accessing user information through local storage
  const location = localStorage.getItem('selectedLocation') || 'Cassie Campbell';
  const nickname = localStorage.getItem('nickname') || 'User';
  const firebaseUID = localStorage.getItem('firebaseUID') || '123';

  // Hook for navigating to the next page
  const navigate = useNavigate();

  // If the user is not logged in, redirect them back to the home page
  useEffect(() => {
    const firebaseUID = localStorage.getItem('firebaseUID');
    if (!firebaseUID) {
      navigate('/');
    }
  }, [navigate]); 

  // Set the button to visible if the user is logged in and in the queue
  const [leaveButtonVisible, setLeaveButtonVisible] = useState<boolean>(false);

  // Check if the user is in the queue after CurrentState component is mounted
  useEffect(() => {
    // Listen for queue changes
    const handleQueueUpdate = () => {
      // Check if the user is in the queue
      const joined = localStorage.getItem('inQueue') === 'true';
      setLeaveButtonVisible(!!firebaseUID && joined)
    };

    // Initial check
    handleQueueUpdate();

    // Event listener for changes in queue
    window.addEventListener('storage', handleQueueUpdate);

    return () => {
      window.removeEventListener('storage', handleQueueUpdate);
    };
  }, []);

  const handleLeaveQueue = async () => {
    try {
      const data = await leaveQueue(location, firebaseUID);

      if (data) {
        setLeaveButtonVisible(false);
        alert('You have successfully left the queue.');
        // Sign out the user after they leave the queue
        // localStorage.setItem("firebaseUID", '');
        // TODO: Call sign out endpoint
        // Redirect to home page
        // navigate('/');
      } else {
        alert('Failed to leave the queue. Please try again.');
      }
    } catch (error) {
      console.error('Error leaving queue:', error);
      alert('An error occurred. Please try again later.');
    }
  }

  return (
    <div className="active-view">
    <div>
      {leaveButtonVisible && (
        <button className="leave-button" onClick={handleLeaveQueue}>
          Leave Queue
        </button>
      )}
    </div>
    <CurrentState />
    </div>
  );
};

export default ActiveView;