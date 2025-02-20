import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ActiveView.css';
import CurrentState from './CurrentState';
import { joinGame } from '../../utils/api';
import { LocalStorageContext } from '../../context/LocalStorageContext';

const ActiveView: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const hasInitializedRef = useRef<boolean>(false);
  
  const context = useContext(LocalStorageContext);
  
  if (!context) {
    return <div>Loading...</div>;
  }

  const { 
    selectedLocation: location,
    nickname,
    token,
    firebaseUID,
    addedToGame,
    setAddedToGame,
    setInQueue 
  } = context;

  useEffect(() => {
    // Check if we have the required data
    if (!firebaseUID || !location || !nickname) {
      navigate('/');
      return;
    }

    // Only initialize if we haven't been added to a game yet
    if (!hasInitializedRef.current && !addedToGame) {
      initializeGame();
      hasInitializedRef.current = true;
    } else {
      // If we're already added to game, just set loading to false
      setLoading(false);
    }
  }, [firebaseUID, location, nickname, navigate, addedToGame]);

  const initializeGame = async () => {
    if (!addedToGame) {
      setLoading(true);
      try {
        console.log("Attempting to join game with:", {
          location,
          nickname,
          firebaseUID
        });

        const response = await joinGame(location, nickname, firebaseUID, token);
        console.log("Join game response:", response);
        
        if (response) {
          context?.setAddedToGame(true);
          context?.setInQueue(true);
        } else {
          throw new Error('Failed to join game');
        }
      } catch (error) {
        console.error('Error joining queue:', error);
        alert('Failed to join the queue. Please try again.');
        // Add this redirect
        navigate('/');
      }
    }
    setLoading(false);
};

  return (
    <div className="active-view">
      {loading ? <p>Loading...</p> : <CurrentState />}
    </div>
  );
};
export default ActiveView;