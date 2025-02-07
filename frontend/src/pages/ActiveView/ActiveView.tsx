import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ActiveView.css';
import CurrentState from './CurrentState';
import { joinGame } from '../../utils/api';
import { LocalStorageContext } from '../../context/LocalStorageContext';
import { AuthContext } from '../../context/AuthContext';

const ActiveView: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const hasInitializedRef = useRef<boolean>(false);
  
  const context = useContext(LocalStorageContext);
  const currentUser = useContext(AuthContext);

  const location = context?.selectedLocation || '';
  const nickname = context?.nickname || '';
  const firebaseUID = context?.firebaseUID || '';

  useEffect(() => {
    if (!currentUser || !context) {
      navigate('/');
      return;
    }

    if (!hasInitializedRef.current) {
      initializeGame();
      hasInitializedRef.current = true;
    }
  }, [currentUser, context, navigate]);

  const initializeGame = async () => {
    const addedToGame = context?.addedToGame;
    if (!addedToGame) {
      setLoading(true);
      try {
        // Add these debug logs
        console.log("Attempting to join game with:", {
          location,
          nickname,
          firebaseUID,
          context: context?.firebaseUID
        });

        const { status } = await joinGame(location, nickname, firebaseUID);
        console.log("Join game response:", status);  // Add this too
        
        context?.setAddedToGame(true);
        context?.setInQueue(status === 'queue' ? true : false);
      } catch (error) {
        console.error('Error joining queue:', error);
        alert('Failed to join the queue. Please try again.');
      }
    }
    setLoading(false);
};

  if (!context || !currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="active-view">
      {loading ? <p>Loading...</p> : <CurrentState />}
    </div>
  );
};

export default ActiveView;